class Device.DisplayComponent extends UIComponent
  @register 'Device.DisplayComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @autorun (computation) =>
      deviceUuid = @currentDeviceUuid()
      return unless deviceUuid

      @subscribe 'Device.one', deviceUuid

      @subscribe 'Data.points', deviceUuid

    @autorun (computation) =>
      return unless @subscriptionsReady()

      device = Device.documents.findOne
        uuid: @currentDeviceUuid()
      ,
        fields:
          title: 1

    @canNew = new ComputedField =>
      !!Meteor.userId()

  device: ->
    Device.documents.findOne
      uuid: @currentDeviceUuid()

  datapoints: ->
    Data.documents.find
      'device._id': @device()?._id

  notFound: ->
    @subscriptionsReady() and not @device()

  ## Todo: Get device info and metadata so we can display it in the template. Ideally we can create 
  ## templates (list, detail, etc.) and data-models that work for a large number of devices... as opposed to 
  ## creating a new template for every device.
  # type: ->
  #   @device.type

  # name: ->
  #   @device.name

  # # Unit of measurement.
  # unit: ->
  #   @device.unit

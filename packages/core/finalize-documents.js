import share from './base';

// We have to call defineAll last to take care of possible recursive references as well.
share.BaseDocument.defineAll();

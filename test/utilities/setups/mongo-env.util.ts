import getenv from 'getenv';

export const getUrl = function(targetName: string): string {
  let url: string;
  switch (targetName) {
    case 'snapshotter':
      url = getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_URL');
      break;
    case 'commitStore':
      url = getenv.string('EVEBLE_COMMITSTORE_MONGODB_URL');
      break;
    case 'scheduler':
      url = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_URL');
      break;
    default:
      url = 'mongodb://localhost:27017';
      break;
  }
  return url;
};

export const getDatabaseName = function(targetName: string): string {
  let databaseName;
  switch (targetName) {
    case 'snapshotter':
      databaseName = getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_DBNAME');
      break;
    case 'commitStore':
      databaseName = getenv.string('EVEBLE_COMMITSTORE_MONGODB_DBNAME');
      break;
    case 'scheduler':
      databaseName = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME');
      break;
    default:
      databaseName = 'eveble_testing';
      break;
  }
  return databaseName;
};

export const isSSL = function(targetName: string): string {
  let isEnabled;
  switch (targetName) {
    case 'snapshotter':
      isEnabled = getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_SSL');
      break;
    case 'commitStore':
      isEnabled = getenv.string('EVEBLE_COMMITSTORE_MONGODB_SSL');
      break;
    case 'scheduler':
      isEnabled = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL');
      break;
    default:
      isEnabled = false;
      break;
  }
  return isEnabled;
};

export const getCollectionName = function(targetName: string): string {
  let collectionName;
  switch (targetName) {
    case 'snapshotter':
      collectionName =
        getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_COLLECTION') || 'snapshots';
      break;
    case 'commitStore':
      collectionName =
        getenv.string('EVEBLE_COMMITSTORE_MONGODB_COLLECTION') || 'commits';
      break;
    case 'scheduler':
      collectionName =
        getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION') ||
        'agendaJobs';
      break;
    default:
      collectionName = 'test';
      break;
  }
  return collectionName;
};

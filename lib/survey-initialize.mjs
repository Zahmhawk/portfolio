import {prepareForBackend} from './sql-backend.mjs';
// surveys has a single primary key, id; duplicate initialization is a no-op.
export function prepareSurveyInitialization(database) {
  return prepareForBackend(database,
    'INSERT OR IGNORE INTO surveys(id,title,description,consent,questions,status,version,config,created_at) VALUES(?,?,?,?,?,?,?,?,?)',
    'INSERT INTO surveys(id,title,description,consent,questions,status,version,config,created_at) VALUES(?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id=id',
  );
}

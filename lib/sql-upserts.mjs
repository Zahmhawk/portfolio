// Each pair is intentionally authored and reviewed against the draft schema's
// primary key. Do not infer a MySQL conversion from arbitrary SQL strings.
export const upsertSql = Object.freeze({
  assistantPreferences: [
    'INSERT INTO assistant_preferences(user_id,memories,skills,budget_usd,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET memories=excluded.memories,skills=excluded.skills,budget_usd=excluded.budget_usd,updated_at=excluded.updated_at',
    'INSERT INTO assistant_preferences(user_id,memories,skills,budget_usd,updated_at) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE memories=VALUES(memories),skills=VALUES(skills),budget_usd=VALUES(budget_usd),updated_at=VALUES(updated_at)',
  ],
  chatProfile: [
    'INSERT INTO chat_profiles(user_id,encrypted_key,model,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET encrypted_key=excluded.encrypted_key,model=excluded.model,updated_at=excluded.updated_at',
    'INSERT INTO chat_profiles(user_id,encrypted_key,model,updated_at) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE encrypted_key=VALUES(encrypted_key),model=VALUES(model),updated_at=VALUES(updated_at)',
  ],
  survey: [
    'INSERT INTO surveys(id,title,description,consent,questions,status,version,config,created_at) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,consent=excluded.consent,questions=excluded.questions,status=excluded.status,config=excluded.config',
    'INSERT INTO surveys(id,title,description,consent,questions,status,version,config,created_at) VALUES(?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title),description=VALUES(description),consent=VALUES(consent),questions=VALUES(questions),status=VALUES(status),config=VALUES(config)',
  ],
});

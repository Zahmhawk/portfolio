// Each pair is intentionally authored and reviewed against the draft schema's
// primary key. Do not infer a MySQL conversion from arbitrary SQL strings.
export const upsertSql = Object.freeze({
  chatConnection: [
    'INSERT INTO chat_connections(id,user_id,provider,label,encrypted_key,models,model,voice_model,position,updated_at,region) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET label=excluded.label,encrypted_key=excluded.encrypted_key,models=excluded.models,model=excluded.model,voice_model=excluded.voice_model,position=excluded.position,updated_at=excluded.updated_at,region=excluded.region',
    'INSERT INTO chat_connections(id,user_id,provider,label,encrypted_key,models,model,voice_model,position,updated_at,region) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE label=VALUES(label),encrypted_key=VALUES(encrypted_key),models=VALUES(models),model=VALUES(model),voice_model=VALUES(voice_model),position=VALUES(position),updated_at=VALUES(updated_at),region=VALUES(region)',
  ],
  assistantSurveyDraft: [
    'INSERT INTO assistant_survey_drafts(user_id,thread_id,data,source_text,generation,proposal_id,state,updated_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(user_id,thread_id) DO UPDATE SET data=excluded.data,source_text=excluded.source_text,generation=excluded.generation,proposal_id=excluded.proposal_id,state=excluded.state,updated_at=excluded.updated_at',
    'INSERT INTO assistant_survey_drafts(user_id,thread_id,data,source_text,generation,proposal_id,state,updated_at) VALUES(?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE data=VALUES(data),source_text=VALUES(source_text),generation=VALUES(generation),proposal_id=VALUES(proposal_id),state=VALUES(state),updated_at=VALUES(updated_at)',
  ],
  content: [
    'INSERT INTO content (id,kind,data,status,position,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,data=excluded.data,status=excluded.status,position=excluded.position,updated_at=excluded.updated_at',
    'INSERT INTO content (id,kind,data,status,position,updated_at) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE kind=VALUES(kind),data=VALUES(data),status=VALUES(status),position=VALUES(position),updated_at=VALUES(updated_at)',
  ],
  chatVoicePreferences: [
    'INSERT INTO chat_profiles(user_id,model,updated_at,auto_fallback,voice_name) VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET auto_fallback=excluded.auto_fallback,voice_name=excluded.voice_name',
    'INSERT INTO chat_profiles(user_id,model,updated_at,auto_fallback,voice_name) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE auto_fallback=VALUES(auto_fallback),voice_name=VALUES(voice_name)',
  ],
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

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    role TEXT,
    status TEXT,
    notes TEXT,
    avatar TEXT,
    lastContact TIMESTAMPTZ
);

CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    contact_id INTEGER REFERENCES contacts(id),
    name TEXT,
    stage TEXT,
    value DECIMAL,
    probability INTEGER,
    expectedClose TIMESTAMPTZ,
    description TEXT,
    owner TEXT,
    ownerAvatar TEXT
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deal_id INTEGER REFERENCES deals(id),
    contact_id INTEGER REFERENCES contacts(id),
    title TEXT,
    description TEXT,
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    status TEXT,
    priority TEXT,
    assignee TEXT,
    assigneeAvatar TEXT
);

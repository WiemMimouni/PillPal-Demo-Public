import * as SQLite from 'expo-sqlite';

export async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync('pilpal');
  await db.execAsync('PRAGMA foreign_keys = ON');

  const createTable = async (query:string, tableName:string) => {
    try {
      await db.execAsync(query);
      console.log(`${tableName} table created successfully`);
    } catch (error) {
      console.error(`Error creating ${tableName} table:`, error);
    }
  };

  await createTable(`CREATE TABLE IF NOT EXISTS country (
    countryid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    countryname TEXT NOT NULL
  );`, 'country');

  await createTable(`CREATE TABLE IF NOT EXISTS delegation (
    delegationid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    delegationname TEXT NOT NULL,
    stateid INTEGER NOT NULL,
    FOREIGN KEY (stateid) REFERENCES state(stateid)
  );`, 'delegation');

  await createTable(`CREATE TABLE IF NOT EXISTS state (
    stateid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    statename TEXT NOT NULL,
    countryid INTEGER NOT NULL,
    FOREIGN KEY (countryid) REFERENCES country(countryid)
  );`, 'state');

  await createTable(`CREATE TABLE IF NOT EXISTS User (
    userid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT,
    countryid INTEGER NOT NULL,
    stateid INTEGER NOT NULL,
    delegationid INTEGER NOT NULL,
    date_of_birth DATE,
    CONSTRAINT user_email_unique UNIQUE (email),
    FOREIGN KEY (countryid) REFERENCES country(countryid),
    FOREIGN KEY (stateid) REFERENCES state(stateid),
    FOREIGN KEY (delegationid) REFERENCES delegation(delegationid)
  );`, 'User');

  await createTable(`CREATE TABLE IF NOT EXISTS medicine (
    pct TEXT PRIMARY KEY NOT NULL,
    medicinename TEXT NOT NULL,
    forme TEXT,
    gp TEXT,
    notice TEXT,
    laboratoire TEXT,
    amm TEXT,
    date_amm DATE,
    tableu BOOLEAN,
    val_duration INTEGER,
    class_terapotique TEXT,
    presentation TEXT,
    dosage TEXT
  );`, 'medicine');

  await createTable(`CREATE TABLE IF NOT EXISTS schedule (
    timeofreceipt TIMESTAMP,
    mealtype TEXT,
    state BOOLEAN DEFAULT 0,
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    treatmentid INTEGER,
    synced BOOLEAN default 1,
    FOREIGN KEY (treatmentid) REFERENCES treatment(treatmentid)
  );`, 'schedule');

  await createTable(`CREATE TABLE IF NOT EXISTS treatment (
    treatmentid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    medicineid TEXT NOT NULL,
    userid INTEGER NOT NULL,
    dayofweek TEXT NOT NULL,
    ongoing BOOLEAN DEFAULT 1,
    startDate TIMESTAMP,
    endDate TIMESTAMP,
    timesperday TEXT,
    quantity TEXT,
    FOREIGN KEY (medicineid) REFERENCES medicine(pct),
    FOREIGN KEY (userid) REFERENCES User(userid)
  );`, 'treatment');

  console.log("Database initialized");
};


import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// add content to the db
export const putDb = async (content) => {
  console.log('Post to the database');

  // Connect to jate database and use version one.
  const jateDb = await openDB('jate', 1);

  // Create new transaction. Specify database and data privileges for transaction.
  const tx = jateDb.transaction('jate', 'readwrite');

  // Open desired object store.
  const store = tx.objectStore('jate');

  // Use .add() method on the store and pass in the content.
  const request = store.put({ id: 1, value: content });

  // Get confirmation of the request.
  const result = await request;
  console.log('🚀 - data saved to the database', result);
};

// get all content from the db
export const getDb = async () => {
  // Connect to jate database and use version one.
  const jateDb = await openDB('jate', 1);

  // Create new transaction. Specify database and data privileges for transaction.
  const tx = jateDb.transaction('jate', 'readonly');

  // Open desired object store.
  const store = tx.objectStore('jate');

  // Use .get() method to get data at a single location in the database.
  const request = store.get(1);

  // Get confirmation of the request.
  const result = await request;
  console.log('result.value', result);
  return result?.value;
};



initdb();

const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

async function initDatabase() {
  try {
    console.log('🔄 Pushing Prisma schema to database...')
    await execPromise('npx prisma db push --accept-data-loss')
    console.log('✅ Database schema pushed successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  }
}

initDatabase()

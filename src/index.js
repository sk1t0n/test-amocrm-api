const dotenv = require('dotenv')
const axios = require('axios')
const constants = require('./constants')

dotenv.config()
const domain = process.env.DOMAIN
const accessToken = process.env.ACCESS_TOKEN
const headers = {
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
}
const limitParam = `limit=${constants.limit}`

const fetchContacts = async (page = 1) => {
  const pageParam = `page=${page}`
  const url = `https://${domain}${constants.contactsUri}&${limitParam}&${pageParam}`

  try {
    const response = await axios.get(url, { headers })

    if (!response.data) {
      console.log('Data is empty, page =', page)
      return false
    }

    for (const contact of response.data._embedded.contacts) {
      const leadsLength = contact._embedded.leads.length
      if (leadsLength === 0) {
        addTask(contact.id)
      }
    }
  } catch (e) {
    console.error('fetchContacts ->', e)
  }
}

async function addTask(contactId) {
  const url = `https://${domain}${constants.tasksUri}`
  const taskSeconds = Math.round(Date.now() / 1000) + 60 * 60 * 24
  const data = [
    {
      task_type_id: 1,
      text: 'Контакт без сделок',
      complete_till: taskSeconds,
      entity_id: contactId,
      entity_type: 'contacts',
    },
  ]

  try {
    const response = await axios.post(url, data, { headers })
    if (response.status === 200) {
      console.log('Task was successfully added, contactId =', contactId)
    } else {
      console.log('Task not added, contactId =', contactId)
    }
  } catch (e) {
    console.error('addTask ->', e)
  }
}

;(async () => {
  let page = 1
  const maxPage = 100
  while (page < maxPage) {
    const result = await fetchContacts(page)
    if (result === false) {
      break
    }
    page++
  }
})()

const apiUri = '.amocrm.ru/api/v4/'
const contactsUri = `${apiUri}contacts?with=leads`
const tasksUri = `${apiUri}tasks`
const limit = 25

module.exports = {
  contactsUri,
  tasksUri,
  limit,
}

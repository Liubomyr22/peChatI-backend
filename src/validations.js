const isValidPassword = (password) => password.length < 6

const isValidName = (name) => /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test(name)


const isValidEmail = (email) => {
  const isMatchRegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    )

  if (isMatchRegExp) {
    const localPart = email.split('@')[0]
    const domainPart = email.split('@')[1]

    if (localPart.length > 64) return false
    return domainPart.length <= 255
  }

  return false
}

export { isValidPassword, isValidName, isValidEmail }
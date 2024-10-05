export const validatePassword = (password: string, confirmPassword: string | null) => {
    
    const hasEightCharacters = password.length >= 8
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    // Bypass confirmation if second password is null
    const passwordsMatch = confirmPassword === null || (password === confirmPassword)

    // console.log(
    //     password,
    //     confirmPassword,
    //     passwordsMatch
    // )

    if (!hasEightCharacters) {
        return { success: false, message: "Must be at least 8 characters long." }
    }
    if (!hasSpecialCharacter) {
        return { success: false, message: "Must contain at least one special character." }
    }
    if (!hasUpperCase) {
        return { success: false, message: "Must contain at least one uppercase letter." }
    }
    if (!hasNumber) {
        return { success: false, message: "Must contain at least one number." }
    }
    if (!passwordsMatch) {
        return { success: false, message: "Passwords do not match." }
    }

    return { success: true, message: "Password is valid." }
}

// Validate Form ( TEMP SPECIFIC TO LOGIN POPUP !!! )
export const validateLoginForm = (data: {name: string, email: string, password: string}, setErrors: React.Dispatch<React.SetStateAction<any>>, stateIsSignUp: boolean) => {
    const { name, email, password } = data
    // console.log(name, email, password, terms)

    const nameValid = Boolean(stateIsSignUp ? name.trim() : true)
    const emailValid = Boolean(email.trim())
    const passwordValid = Boolean(stateIsSignUp ? validatePassword(password, null).success : password.trim())
    // const termsValid = Boolean(stateIsSignUp ? terms : true)
    const errorCheck = nameValid && emailValid && passwordValid // && termsValid

    // console.log(errorCheck)
    // console.log(nameValid, emailValid, passwordValid)

    setErrors({
        name: nameValid ? '' : "Name cannot be blank.",
        email: emailValid ? '' : "Email cannot be blank.",
        password: passwordValid ? '' : stateIsSignUp ? validatePassword(password, null).message : "Password cannot be blank.",
        // terms: termsValid ? '' : "You must accept the terms and conditions.",
        errorExists: !errorCheck
    })

    return errorCheck
}
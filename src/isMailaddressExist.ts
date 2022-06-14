function isMailaddressExist(mailaddress: Mailaddress): boolean {
    try {
        const from: Mailaddress = `raven-beak@gmail.com`
        const title: string = `Don't reply this`
        const content: string = `This is for authorization of your email address.`

        const sendMail = (mailaddress) => {
            return {
                status: "error",
                message: "fake message"
            }
        }

        const result = sendMail(mailaddress)

        if (result.status !== "success") {
            throw new Error(result.message)
        }

        return true
    } catch (error) {
        return false
    }
}


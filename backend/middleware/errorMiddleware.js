// These are automatically triggered when an error is thrown in a Routes function


// 404 Not Found
const notFoundHandler = (req, res, next) => {
    console.log("\n IN NOT FOUND HANDLER --------------------------- \n")

    // const error = new Error(`API Not Found - ${req.originalUrl}`)
    // error.status = 404

    // res.status(404)

    next({ status: 404, clientMessage: `API Not Found - ${req.originalUrl}` })
    // next(error, "API Not Found")


    // const error = new Error(`API Not Found - ${req.originalUrl}`)
}


// Error Handler
const errorHandler = (error, req, res, next) => { // DO NOT REMOVE 'next'
    console.log("\n IN ERROR HANDLER --------------------------- \n")

    const {serverError="", clientMessage="Internal Server Error!", action=""} = error
    
    if (error) {
        const formattedAction = action ? " - " + action : ""
        const finalClientMessage = "ERROR" + formattedAction + ": " + clientMessage

        // For debugging purposes
        // console.log(error)
        console.log(error.status)
        // console.log(clientMessage)

        // Generic response
        res.status(error.status || 500) // Status - Overwrite Check + Code Update
        res.json({ success: false, error: finalClientMessage })

        // res.json({ status: error.status || 500, success: false, error: error }) 
    }
}


export {
    notFoundHandler, 
    errorHandler
}
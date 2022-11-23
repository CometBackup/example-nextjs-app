// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const comet = require('comet-js-sdk')

export default async function handler(req, res) {
    const cs = new comet.CometServer({
        url: process.env.COMET_URL,
        username: process.env.COMET_ADMIN_USER,
        password: process.env.COMET_ADMIN_PASSWORD
    })
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            error: "Expected a name and a password parameter"
        })
        return
    }

    try {
        const userP = await cs.AdminAddUserP(req.body.username, req.body.password)

        const userSession = await cs.AdminAccountSessionStartAsUserP(req.body.username)
        userSession.SessionKey
        res.status(200).json({
            status: 'OK',
            sessionKey: userSession.SessionKey,
            url: process.env.COMET_URL,
            username: req.body.username
        })
    } catch (e) {
        res.status(500).json({
            error: e.toString()
        })
    }



}

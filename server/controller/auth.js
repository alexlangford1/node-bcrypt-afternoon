const bcrypt = require("bcryptjs")

module.exports = {
    register: async (req, res) => {
        const { username, password, isAdmin } = req.body
        const db = req.app.get("db")

        let response = await db.get_user(username)
        let existingUser = response[0]
        if (existingUser) {
            return res.status(409).send("git a life loser")
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let registeredUser = await db.register_user(isAdmin, username, hash)
        let user = registeredUser[0]

        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username,
        }
        res.status(201).send(req.session.user)
    },

    login: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get("db")
        let response = await db.get_user(username)
        let user = response[0]
        if (!user) {
            res.status(401).send("please register")
        }

        const isAuth = bcrypt.compareSync(password, user.hash)
        if (!isAuth) {
            res.status(403).send("incorrect password bruhh")
        }
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username,
        }
        res.status(201).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}

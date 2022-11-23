import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState} from "react";

export default function Home() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const didSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(false)
        const data = new FormData(e.target)
        const post = {}
        for (const pair of data.entries()) {
            post[pair[0]] = pair[1]
        }

        const res = await fetch('api/register', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(post)
        })

        if (res.status > 299 || res.status < 200) {
            console.error(res)
            const err = await res.json()
            setLoading(false)
            setError(err)
            return
        }
        const body = await res.json()

        const wnd = window.open(body.url)
        if (wnd === null) {
            alert('please open ' +body.url  + " to continue the login ")
        }
        window.addEventListener('message', () => {

            wnd.postMessage(           {
                    msg: "user_session_login",
                    username: body.username,
                sessionkey: body.sessionKey},
                body.url,)

            window.close()
        }, body.url)

    }
    return (
        <div className={styles.container}>
            <Head>
                <title>Hello comet Server</title>
                <meta name="description" content="An App for registering new users on your comet server"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to Comet Server
                </h1>

                <p className={styles.description}>
                    Start backing up with the best Backup Software
                </p>
                {error &&
                    <pre className={styles.errorBox}>{JSON.stringify(error, null, '  ')}</pre>}
                {!loading?
                <form className={styles.signupForm} onSubmit={didSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username"/>

                    <label htmlFor="password"> Password</label>
                    <input type="password" id="password" name="password"/>
                    <button>Launch Now</button>
                </form>: <>Loading...</>}
            </main>

            <footer className={styles.footer}>
                An example app create by Comet Backup
            </footer>
        </div>
    )
}

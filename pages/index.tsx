import Head from 'next/head'
import PathCalculator from '../src/components/PathCalculator'
import 'react-toastify/dist/ReactToastify.css'

const Home = () => {
    return (
        <>
            <Head>
                <title>EVE Online - Traffic Jam - Route Calculator</title>
                <meta name="description" content="EVE Online pathfinding tool"></meta>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            </Head>
            <PathCalculator />
            <style jsx global>{`
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Exo 2', sans-serif;
                    background-color: #1f1f1f;
                }
                .ant-layout {
                    background-color: #1f1f1f;
                }
                a {
                    color: inherit;
                    text-decoration: none;
                }
                * {
                    box-sizing: border-box;
                }
            `}</style>
        </>
    )
}

export default Home 
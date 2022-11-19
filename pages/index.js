import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

import styles from "../styles/Home.module.css";
import Raffle from "../components/Raffle";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Lottery smart contract</title>
        <meta name="description" content="Lottery" />
      </Head>
      <Header />
      <Raffle />
      <Footer />
    </div>
  );
}

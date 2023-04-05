import styles from '@/styles/Home.module.css';

export const Button = (props) => {
  if (props.walletConnected) {
    return (
      <div className={styles.button_container}>
        <button className={styles.button} onClick={props.mint}>
          mint
        </button>
      </div>
    );
  } else {
    return (
      <button onClick={props.connectWallet} className={styles.button}>
        Connect Wallet
      </button>
    );
  }
};

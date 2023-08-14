import { Keypair, Connection, PublicKey, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { keypair, mint_address } from "./config"


// Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;


(async () => {
    try {
        // Create an associated token account!
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint_address,
            keypair.publicKey
            // new PublicKey('4XBdFfQdUTW7dpmFv9w8aJX9L8tf5FKkeVzQwm8Ncsjk')
        )
        console.log('keypair.publicKey', keypair.publicKey)
        console.log(`You've successfully created or found an existing ATA account:\n${tokenAccount.address.toBase58()}\n`)

        // Mint some tokens to the account!
        const txhash = await mintTo(
            connection,
            keypair,
            mint_address,
            tokenAccount.address,
            keypair,
            1000000000
        )
        console.log(`Success! Check out your mint TX here:\nhttps://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (error: any) {
        if (error.name === "TokenAccountNotFoundError") {
            console.log("Failed to find Token Account. This is probably because we are trying to use it before a block has been found confirming it. Wait a few seconds and try again.")
        } else {
            console.log(`Oops, something went wrong: ${error}`)
        }
    }
})()
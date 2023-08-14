import { Commitment, Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import { keypair, mint_address } from "./config"
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";


//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

// Create PDA for token metadata
const metadata_seeds = [
    Buffer.from('metadata'),
    token_metadata_program_id.toBuffer(),
    mint_address.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);

(async () => {
    try {
        const tx = new Transaction().add(
            // Add the Create metadata instruction
            createCreateMetadataAccountV3Instruction(
                {
                    metadata: metadata_pda,
                    mint: mint_address,
                    mintAuthority: keypair.publicKey,
                    payer: keypair.publicKey,
                    updateAuthority: keypair.publicKey,
                },
                {
                    createMetadataAccountArgsV3: {
                        data: {
                            name: "Monkey Token 2",
                            symbol: "MT2",
                            uri: "", // Arweave URI link which uses metaplex standard
                            sellerFeeBasisPoints: 0,
                            creators: null,
                            collection: null,
                            uses: null
                        },
                        isMutable: true,
                        collectionDetails: null
                    }
                }
            )
        )
        const txhash = await sendAndConfirmTransaction(connection, tx, [keypair]);

        console.log(`Success! Check out your TX here:\nhttps://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
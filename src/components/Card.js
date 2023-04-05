import React, { useState, useEffect } from 'react';
import { NFT_CONTRACT_ADDRESS, abi } from '../../constants/index.js';

function Card({ data }) {
  return (
    <div>
      <h2>{data.name}</h2>
      <img src={data.image} alt={data.name} />
      <p>{data.description}</p>
    </div>
  );
}

function CardsList() {
  const [metadata, setMetadata] = useState([]);
  useEffect(() => {
    async () => {
      try {
        const signer = await getProviderOrSigner(true);
        const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
        const address = await signer.getAddress();

        const nftBalance = await nftContract.tokenURI(1);
        setMetadata([metadata, ...nftBalance]);
        console.log('bla', nftBalance);
      } catch (error) {
        console.error(error);
      }
    };
  }, [metadata]);
  return (
    <div>
      {metadata.map((data, index) => (
        <Card key={index} data={data} />
      ))}
    </div>
  );
}

export default CardsList;

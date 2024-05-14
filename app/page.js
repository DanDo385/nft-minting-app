import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

const nftAddress = "Your_Deployed_Contract_Address";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenURI, setTokenURI] = useState("");
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const initProvider = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      const web3Signer = web3Provider.getSigner();
      setSigner(web3Signer);
      const nftContract = new ethers.Contract(nftAddress, NFT.abi, web3Signer);
      setContract(nftContract);
    };
    initProvider();
  }, []);

  const mintNFT = async () => {
    try {
      const tx = await contract.mintNFT(await signer.getAddress(), tokenURI);
      await tx.wait();
      fetchNFTs();
    } catch (error) {
      console.error("Error minting NFT: ", error);
    }
  };

  const fetchNFTs = async () => {
    const totalSupply = await contract.tokenCounter();
    const items = [];
    for (let i = 0; i < totalSupply; i++) {
      const uri = await contract.tokenURI(i);
      const response = await fetch(uri);
      const metadata = await response.json();
      items.push(metadata);
    }
    setNfts(items);
  };

  useEffect(() => {
    if (contract) {
      fetchNFTs();
    }
  }, [contract]);

  return (
    <div>
      <h1>Mint NFT</h1>
      <input
        type="text"
        placeholder="IPFS URL to metadata"
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
      />
      <button onClick={mintNFT}>Mint</button>
      <h2>Your NFTs</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {nfts.map((nft, index) => (
          <div key={index} style={{ border: '1px solid #000', margin: '10px', padding: '10px' }}>
            <img src={nft.image} alt={nft.name} style={{ width: '100px', height: '100px' }} />
            <h3>{nft.name}</h3>
            <p>{nft.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

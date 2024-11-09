import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Smart contract details
const contractAddress = "0xa21Ef89844edb83EbdfDa83dB2400fb7e837C9c2"; // deployed contract address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "greet",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSubmittedNames",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "submittedNames",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

function App() {
  const [greeting, setGreeting] = useState('');
  const [submittedNames, setSubmittedNames] = useState([]);
  const [contract, setContract] = useState(null);

  // Initialize ethers.js and set up the contract instance
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Set up provider and signer
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          // Create contract instance
          const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        alert("Please install MetaMask to interact with the application!");
      }
    };

    init();
  }, []);

  // Handle greeting submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
  
    if (contract) {
      try {
        const tx = await contract.greet(name);
        await tx.wait(); // Wait for transaction to be mined
        setGreeting(`Hello, ${name}`);
        console.log("Transaction successful:", tx.hash);
      } catch (error) {
        console.error("Error calling greet:", error.message, error.code);
      }
    } else {
      console.error("Contract instance is not available.");
    }
  };
  

  // Fetch submitted names
  const fetchSubmittedNames = async () => {
    console.log('fetching names');
    console.log('contract', contract);
    if (contract) {
      try {
        const names = await contract.getSubmittedNames();
        setSubmittedNames(names);
      } catch (error) {
        console.error("Error fetching submitted names:", error.message, error.code);
      }
    } else {
      console.error("Contract instance is not available.");
    }
  };
  

  return (
    <main>
      <h1>Hello World DApp</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" type="text" placeholder="Your name" required />
        <button type="submit">Submit</button>
      </form>
      <section>
        <h2>Greeting</h2>
        <p>{greeting}</p>
      </section>
      <section>
        <h2>Submitted Names</h2>
        <button onClick={fetchSubmittedNames}>Fetch Names</button>
        <ul>
          {submittedNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    // =======================================================================
    // 1. Desplegar el contrato MyToken (ERC20)
    // =======================================================================
    console.log("------------------------------------------");
    console.log("1. Deploying MyToken contract...");
    
    // Define la cantidad de tokens que se acuñarán inicialmente.
    const initialSupply = ethers.parseUnits("1000000", 18); // 1 millón de tokens

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(initialSupply);
    await myToken.waitForDeployment();
    
    const tokenAddress = await myToken.getAddress();
    console.log(`✅ MyToken contract deployed to address: ${tokenAddress}`);

    // =======================================================================
    // 2. Desplegar el contrato MyNFT (ERC721)
    // =======================================================================
    console.log("------------------------------------------");
    console.log("2. Deploying MyNFT contract...");

    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();
    await myNFT.waitForDeployment();

    const nftAddress = await myNFT.getAddress();
    console.log(`✅ MyNFT contract deployed to address: ${nftAddress}`);

    // =======================================================================
    // 3. Desplegar el contrato Marketplace
    // =======================================================================
    console.log("------------------------------------------");
    console.log("3. Deploying Marketplace contract...");

    // Obtenemos la fábrica del contrato Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");

    // Desplegamos el contrato, pasando las direcciones de los contratos anteriores
    const marketplace = await Marketplace.deploy(nftAddress, tokenAddress);
    await marketplace.waitForDeployment();

    const marketplaceAddress = await marketplace.getAddress();
    console.log(`✅ Marketplace contract deployed to address: ${marketplaceAddress}`);

    console.log("------------------------------------------");
    console.log("Deployment finished successfully!");
    console.log(" ");
    console.log("📋 Contract Addresses:");
    console.log(`   - MyToken:     ${tokenAddress}`);
    console.log(`   - MyNFT:       ${nftAddress}`);
    console.log(`   - Marketplace: ${marketplaceAddress}`);
    console.log(" ");

    // Guardar las direcciones para que el frontend las utilice
    const addresses = {
        MyToken: tokenAddress,
        MyNFT: nftAddress,
        Marketplace: marketplaceAddress,
    };
    fs.writeFileSync(
        "frontend/addresses.json",
        JSON.stringify(addresses, null, 2)
    );
    console.log("✅ Saved contract addresses to frontend/addresses.json");

    // Opcional: Mintear un NFT de prueba y aprobar el Marketplace para transferirlo
    const [deployer] = await ethers.getSigners();
    console.log("------------------------------------------");
    console.log("4. Minting a test NFT and approving the Marketplace...");

    // Mint a test NFT for the deployer
    const tokenURI = "ipfs://Qmb8Vz1y4d2zL2T3zL3Y4g5R6w7x8y9z0a1b2c3d4e5f6"; // Replace with your IPFS URI
    const mintTx = await myNFT.safeMint(deployer.address, tokenURI);
    await mintTx.wait();
    console.log(`✅ Minted NFT with ID 0 to deployer: ${deployer.address}`);

    // Approve the Marketplace contract to manage the NFT
    const approveTx = await myNFT.approve(marketplaceAddress, 0); // Approve token ID 0
    await approveTx.wait();
    console.log(`✅ Approved Marketplace to manage NFT ID 0`);

    console.log("------------------------------------------");
}

// Se recomienda usar este patrón para manejar errores
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

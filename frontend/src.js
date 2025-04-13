import {
    loadContract,
    getOwner,
    setPresident,
    setScrutineer,
    setSecretary,
    addResolution,
    voteOnResolution,
    getResolutionResults,
    addToWhitelist,
    addSingleToWhitelist,
    isWhitelisted,
    removeFromWhitelist
} from './app.js';

window.addEventListener('load', async () => {
    await loadContract();

    document.getElementById("get-owner-btn").addEventListener("click", async () => {
        try {
            const owner = await getOwner();
            document.getElementById("owner-output").innerText = `ID du propriétaire: ${owner}`;
        } catch (error) {
            console.error("Error fetching owner:", error);
        }
    });

    document.getElementById("set-president-btn").addEventListener("click", async () => {
        const address = document.getElementById("president-address").value;
        try {
            await setPresident(address);
            document.getElementById("president-message").innerText = `L'ID ${address} est désormais Président!`;
        } catch (error) {
            console.error("Error setting president:", error);
        }
    });

    document.getElementById("set-scrutineer-btn").addEventListener("click", async () => {
        const address = document.getElementById("scrutineer-address").value;
        try {
            await setScrutineer(address);
            document.getElementById("scrutineer-message").innerText = `L'ID ${address} est désormais Scrutinateur!`;
        } catch (error) {
            console.error("Error setting scrutineer:", error);
        }
    });

    document.getElementById("set-secretary-btn").addEventListener("click", async () => {
        const address = document.getElementById("secretary-address").value;
        try {
            await setSecretary(address);
            document.getElementById("secretary-message").innerText = `L'ID ${address} est désormais Secrétaire!`;
        } catch (error) {
            console.error("Error setting secretary:", error);
        }
    });

    document.getElementById("add-resolution-btn").addEventListener("click", async () => {
        const title = document.getElementById("resolution-title").value;
        try {
            await addResolution(title);
            alert("Résolution ajoutée avec succès!");
        } catch (error) {
            console.error("Error adding resolution:", error);
        }
    });

    document.getElementById("vote-btn").addEventListener("click", async () => {
        const resolutionId = document.getElementById("resolution-id").value;
        const voteType = document.getElementById("vote-type").value;
        try {
            await voteOnResolution(resolutionId, voteType);
            alert("Vote soumis avec succès!");
        } catch (error) {
            console.error("Error voting on resolution:", error);
        }
    });

    document.getElementById("get-results-btn").addEventListener("click", async () => {
        const resolutionId = document.getElementById("results-resolution-id").value;
        try {
            const results = await getResolutionResults(resolutionId);
            document.getElementById("results-output").innerText = `Votes Pour: ${results[0]}\nVotes Contre: ${results[1]}\nVotes Neutre: ${results[2]}\nTotal Votes: ${results[3]}`;
        } catch (error) {
            console.error("Error fetching resolution results:", error);
        }
    });

    document.getElementById("add-single-to-whitelist-btn").addEventListener("click", async () => {
        const address = document.getElementById("single-whitelist-address").value;

        if (!web3.utils.isAddress(address)) {
            console.error("Invalid address format:", address);
            alert("L'adresse saisie n'est pas valide. Veuillez entrer une adresse Ethereum valide.");
            return;
        }

        try {
            const tx = {
                from: window.ethereum.selectedAddress,
                gas: 2000000, // Augmentez les frais de gaz si nécessaire
            };

            console.log(`Adding address ${address} to whitelist with tx:`, tx);

            // Écouteur d'événement pour capturer l'événement AddedBeneficiary
            contract.events.AddedBeneficiary({
                filter: { _beneficiary: address },
                fromBlock: 'latest'
            }).on('data', (event) => {
                console.log("AddedBeneficiary event received:", event.returnValues);
                document.getElementById("single-whitelist-add-message").innerText = `L'adresse ${address} a été ajoutée à la whitelist!`;
            }).on('error', (error) => {
                console.error("Error in AddedBeneficiary event:", error);
            });

            const receipt = await contract.methods.addSingleToWhitelist(address).send(tx);
            console.log("Transaction receipt:", receipt);

            const isWhitelistedStatus = await isWhitelisted(address);
            console.log(`Whitelist status for ${address} after addition:`, isWhitelistedStatus);
        } catch (error) {
            console.error("Error adding single address to whitelist:", error);
        }
    });

    document.getElementById("add-to-whitelist-btn").addEventListener("click", async () => {
        const address = document.getElementById("whitelist-address").value;
        try {
            await addToWhitelist([address]);
            document.getElementById("whitelist-add-message").innerText = `L'adresse ${address} a été ajoutée à la whitelist!`;
        } catch (error) {
            console.error("Error adding to whitelist:", error);
        }
    });

    document.getElementById("check-whitelist-btn").addEventListener("click", async () => {
        const address = document.getElementById("check-whitelist-address").value;
        try {
            const isWhitelistedStatus = await isWhitelisted(address);
            document.getElementById("whitelist-check-message").innerText = `L'adresse ${address} est ${isWhitelistedStatus ? '' : 'pas '}whitelistée.`;
        } catch (error) {
            console.error("Error checking whitelist:", error);
        }
    });

    document.getElementById("remove-from-whitelist-btn").addEventListener("click", async () => {
        const address = document.getElementById("remove-whitelist-address").value;
        try {
            await removeFromWhitelist(address);
            document.getElementById("whitelist-remove-message").innerText = `L'adresse ${address} a été supprimée de la whitelist!`;
        } catch (error) {
            console.error("Error removing from whitelist:", error);
        }
    });
});

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

contract Whitelist {
    mapping(address => bool) public whitelist;
    event AddedBeneficiary(address indexed _beneficiary);

    /**
     * @notice Vérifie si une adresse est whitelistée.
     * @param _beneficiary L'adresse à vérifier.
     * @return true si l'adresse est whitelistée, false sinon.
     */
    function isWhitelisted(address _beneficiary) public view returns (bool) {
        // Vérifie si l'adresse est correctement formatée
        if (isAddress(_beneficiary)) {
            return whitelist[_beneficiary];
        }
        return false;
    }

    /**
     * @notice Ajoute plusieurs adresses à la whitelist.
     * @param _beneficiaries La liste des adresses à ajouter.
     */
    function addToWhitelist(address[] calldata _beneficiaries) public {
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            whitelist[_beneficiaries[i]] = true;
            emit AddedBeneficiary(_beneficiaries[i]);
        }
    }

    /**
     * @notice Ajoute une seule adresse à la whitelist.
     * @param _beneficiary L'adresse à ajouter.
     */
    function addSingleToWhitelist(address _beneficiary) public {
        whitelist[_beneficiary] = true;
        emit AddedBeneficiary(_beneficiary);
    }

    /**
     * @notice Supprime une adresse de la whitelist.
     * @param _beneficiary L'adresse à supprimer.
     */
    function removeFromWhitelist(address _beneficiary) public {
        whitelist[_beneficiary] = false;
    }

    /**
     * @notice Vérifie si une adresse est correctement formatée.
     * @param _address L'adresse à vérifier.
     * @return true si l'adresse est correctement formatée, false sinon.
     */
    function isAddress(address _address) internal pure returns (bool) {
        return _address != address(0);
    }
}

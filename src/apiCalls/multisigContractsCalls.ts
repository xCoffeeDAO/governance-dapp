import { logout } from '@multiversx/sdk-dapp/utils';
import axios, { AxiosError } from 'axios';
import uniqBy from 'lodash/uniqBy';
import { network } from 'config';
import { verifiedContractsHashes } from 'helpers/constants';
import { storageApi } from 'services/accessTokenServices';
import { MultisigContractInfoType } from 'types/multisigContracts';
import { routeNames } from '../routes';

const contractsInfoStorageEndpoint = `${storageApi}/settings/multisig`;

const multisigAxiosInstance = axios.create();

multisigAxiosInstance.interceptors.request.use(
  async function (config) {
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

multisigAxiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      logout(routeNames.unlock);
    }
    return Promise.reject(error);
  }
);

export async function validateMultisigAddress(address: string) {
  try {
    const response = await axios.get(
      `${network.apiAddress}/accounts/${address}`
    );
    const { data } = response;

    if (data != null) {
      return verifiedContractsHashes.includes(data?.codeHash);
    }
  } catch (err) {
    console.error('error validating multisig address');
    return false;
  }
}

export async function getIsContractTrusted(address?: string) {
  try {
    if (!address) {
      return false;
    }
    const response = await axios.get(
      `${network.apiAddress}/address/${address}`
    );
    const { data, code } = response.data;
    if (code === 'successful') {
      const {
        account: { codeHash }
      } = data;
      return codeHash != null && verifiedContractsHashes.includes(codeHash);
    }
    return false;
  } catch (err) {
    console.error('error validating contract');
    return false;
  }
}

export async function addContractToMultisigContractsList(
  newContract: MultisigContractInfoType
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = uniqBy(
    [...currentContracts, newContract],
    (contract) => contract.address
  );
  await multisigAxiosInstance.post(contractsInfoStorageEndpoint, newContracts);
  return newContracts;
}

export async function updateMultisigContractOnServer(
  newContract: MultisigContractInfoType
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = currentContracts.map((contract) => {
    if (contract.address === newContract.address) {
      return { ...contract, ...newContract };
    }
    return contract;
  });
  await multisigAxiosInstance.post(contractsInfoStorageEndpoint, newContracts);
  return newContracts;
}

export async function removeContractFromMultisigContractsList(
  deletedContractAddress: string
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = currentContracts.filter(
    (contract) => contract.address != deletedContractAddress
  );
  await multisigAxiosInstance.post(contractsInfoStorageEndpoint, newContracts);
  return newContracts;
}

export async function getUserMultisigContractsList(): Promise<
  MultisigContractInfoType[]
> {
  try {
    const response = await multisigAxiosInstance.get(
      contractsInfoStorageEndpoint
    );
    const { data } = response;
    if (data != null) {
      return data;
    }
    return [];
  } catch (err) {
    console.error('error getting multisig contracts');
    return [];
  }
}

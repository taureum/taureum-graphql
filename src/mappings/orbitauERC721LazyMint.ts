import { BigInt, crypto, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  OrbitauERC721LazyMint,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Paused,
  Redeem,
  Transfer,
  Unpaused
} from "../types/OrbitauERC721LazyMint/OrbitauERC721LazyMint"
import { Token, Owner, History, TotalTransaction } from "../types/schema"

export function handleTransfer(event: Transfer): void {
  let id = event.params.tokenId.toHex();
  let token = Token.load(id);
  if (token == null) {
    token = new Token(id);
  }
  token.tokenId = event.params.tokenId;
  token.address = event.params.to;
  token.save();
  if (event.params.from.toHex() != '0x0000000000000000000000000000000000000000') {
    let fromId = event.params.from.toHex();
    let from = Owner.load(fromId);
    if (from == null) {
      from = new Owner(fromId);
      from.count = BigInt.fromI32(0);
      from.address = event.params.from
    }
    else {
      from.count = from.count.minus(BigInt.fromI32(1));
    }
    from.save()
  }

  let toId = event.params.to.toHex();
  let to = Owner.load(toId);
  if (to == null) {
    to = new Owner(toId);
    to.count = BigInt.fromI32(1);
    to.address = event.params.to
  }
  else {
    to.count = to.count.plus(BigInt.fromI32(1));
  }
  to.save();

  _syncHistory(event);
}

export function handleApprovalForAll(event: ApprovalForAll): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

export function handlePaused(event: Paused): void { }

export function handleRedeem(event: Redeem): void { }

export function handleUnpaused(event: Unpaused): void { }

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }

  // BigInt and BigDecimal math are supported
  //entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  //entity.owner = event.params.owner
  //entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  //entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.baseURI(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.paused(...)
  // - contract.signers(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenByIndex(...)
  // - contract.tokenOfOwnerByIndex(...)
  // - contract.tokenType(...)
  // - contract.tokenURI(...)
  // - contract.totalSupply(...)
}

function _syncHistory(event: Transfer): void {
  let id = crypto.keccak256(event.transaction.hash).toHex();
  let history = History.load(id)
  if (history == null) {
    history = new History(id);
    history.blockNumber = event.block.number;
    history.blockTime = event.block.timestamp;
    history.txHash = event.transaction.hash;
    history.tokenId = event.params.tokenId;
    history.tokenIdHex = event.params.tokenId.toHexString();
    history.fromAddress = event.params.from;
    history.toAddress = event.params.to;
    history.save();
  }

  let totalId = event.params.tokenId.toHexString();
  let total = TotalTransaction.load(totalId);
  if (total == null) {
    total = new TotalTransaction(totalId);
    total.tokenId = event.params.tokenId;
    total.tokenIdHex = event.params.tokenId.toHexString();
    total.count = BigInt.fromI32(1);
  }
  else {
    total.count = total.count.plus(BigInt.fromI32(1));
  }
  total.save();
}

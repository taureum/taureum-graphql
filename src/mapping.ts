import {
  Mint
} from "./types/TaureumNFT/TaureumNFT";
import {
  ERC721Mint
} from "./types/schema";

export function handleERC721Mint(event: Mint): void {
  let id = event.transaction.hash.toHex();
  let entity = ERC721Mint.load(id);
  if (!entity) {
    entity = new ERC721Mint(id);
    entity.timestamp = event.block.timestamp;
    entity.blockNumber = event.block.number;
  }
  entity.from = event.transaction.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;
  entity.uri = event.params.uri;
  entity.expiryBlock = event.params.expiryDate;
  entity.save();
}

import { BigInt, crypto, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  OrderApprovedPartOne,
  OrderApprovedPartTwo,
  OrderCancelled,
  OrdersMatched,
  OwnershipTransferred
} from "../types/TaureumExchange/TaureumExchange"
import { OrderHistory } from "../types/schema"

export function handleOrderApprovedPartOne(event: OrderApprovedPartOne): void {
}

export function handleOrderApprovedPartTwo(event: OrderApprovedPartTwo): void { }

export function handleOrderCancelled(event: OrderCancelled): void { }

export function handleOrdersMatched(event: OrdersMatched): void {
  let id = crypto.keccak256(event.transaction.hash).toHex();
  let history = OrderHistory.load(id)
  if (history == null) {
    history = new OrderHistory(id);
    history.blockNumber = event.block.number;
    history.blockTime = event.block.timestamp;
    history.txHash = event.transaction.hash;
    history.buyHash = event.params.buyHash;
    history.sellHash = event.params.sellHash;
    history.maker = event.params.maker;
    history.taker = event.params.taker;
    history.price = event.params.price;
    history.metadata = event.params.metadata;
    history.save();
  }

}

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

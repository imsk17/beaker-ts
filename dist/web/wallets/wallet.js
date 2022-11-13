"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
class Wallet {
    constructor(network, data) {
        this.accounts = data ? data.acctList : [];
        this.defaultAccountIdx = data ? data.defaultAcctIdx : 0;
        this.network = network;
    }
    isConnected() {
        return this.accounts && this.accounts.length > 0;
    }
    setDefaultIdx(idx) {
        this.defaultAccountIdx = idx;
    }
    getDefaultAddress() {
        if (!this.isConnected())
            throw new Error('Not connected');
        const defaultAcct = this.accounts[this.defaultAccountIdx];
        if (defaultAcct === undefined)
            throw new Error('No default account set');
        return defaultAcct;
    }
    // Implement in the child class
    static displayName() {
        throw new Error('Not implemented');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static img(_inverted) {
        throw new Error('Not implemented');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    async connect(_settings) {
        throw new Error('Not implemented');
    }
    disconnect() {
        this.accounts = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sign(_txns) {
        throw new Error('Not implemented');
    }
    serialize() {
        return {
            acctList: this.accounts,
            defaultAcctIdx: this.defaultAccountIdx,
        };
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dlYi93YWxsZXRzL3dhbGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFhQSxNQUFhLE1BQU07SUFRakIsWUFBWSxPQUFlLEVBQUUsSUFBZ0I7UUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxhQUFhLENBQUMsR0FBVztRQUN2QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxDQUFDO0lBQy9CLENBQUM7SUFFRCxpQkFBaUI7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFMUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMxRCxJQUFJLFdBQVcsS0FBSyxTQUFTO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRCwrQkFBK0I7SUFDL0IsTUFBTSxDQUFDLFdBQVc7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCw2REFBNkQ7SUFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFrQjtRQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGlHQUFpRztJQUNqRyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQWU7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCxJQUFJLENBQUMsS0FBb0I7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTztZQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixjQUFjLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtTQUN6QixDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQTVERCx3QkE0REMifQ==
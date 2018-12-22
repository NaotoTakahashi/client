
class ContainerRegister {
	constructor() {
		this.containerMap = {};
	}
	regist(containerId, container) {
		if(Object.keys(this.containerMap).includes(containerId)) {
			this.DUPLICATE_ERROR();
		}
		this.containerMap[containerId] = container;
	}

	getContainer(containerId) {
		if(Object.keys(this.containerMap).includes(containerId)) {
			return this.containerMap[containerId];
		}
		return null;
	}

	getContainerId(container) {
		return Object.keys(this.containerMap).find(key => this.containerMap[key] === container);
		// if not found then return undefined.
	}
}

export default new ContainerRegister();

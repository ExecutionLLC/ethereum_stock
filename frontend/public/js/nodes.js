const Nodes = (() => {
    let nodes = null;
    let currentNode = null;

    const DEFAULT_NODES = {
        Node1: {
            name: 'igor',
            url: 'http://192.168.1.101:8111/',
            chainId: 15
        },
        Node2: {
            name: 'dima',
            url: 'http://192.168.1.104:8111/',
            chainId: 15
        }
    };
    const DEFAULT_NODE_ID = 'Node1';

    const Storage = {
        _CURRENT_KEY: 'selectedNodeValue',
        _NODES_KEY: 'Nodes',
        storeCurrent(id) {
            localStorage.setItem(Storage._CURRENT_KEY, id);
        },
        fetchCurrent() {
            return localStorage.getItem(Storage._CURRENT_KEY);
        },
        storeNodes(nodes) {
            localStorage.setItem(Storage._NODES_KEY, JSON.stringify(nodes));
        },
        fetchNodes() {
            try {
                return JSON.parse(localStorage.getItem(Storage._NODES_KEY)) || null;
            }
            catch(e) {
                return null;
            }
        }
    };

    function setNodes(newNodes) {
        nodes = newNodes;
        Storage.storeNodes(nodes);
    }

    function setCurrentNode(id) {
        currentNode = id;
        Storage.storeCurrent(id);
    }

    function init() {
        nodes = Storage.fetchNodes();
        if (!nodes || !Object.keys(nodes).length) {
            setNodes(
                Object.assign(
                    Object.create(null),
                    DEFAULT_NODES
                )
            );
        }
        currentNode = Storage.fetchCurrent();
        if (currentNode == null || !nodes[currentNode]) {
            if (nodes[DEFAULT_NODE_ID]) {
                setCurrentNode(DEFAULT_NODE_ID);
            } else {
                setCurrentNode(Object.keys(nodes)[0])
            }
        }
    }

    init();

    return {
        getCurrentNode() {
            return nodes[currentNode];
        }
    };
})();
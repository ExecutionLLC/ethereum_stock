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

    function cloneNodes(nodes) {
        return Object.assign(
            Object.create(null),
            nodes
        );
    }

    function init() {
        nodes = Storage.fetchNodes();
        if (!nodes || !Object.keys(nodes).length) {
            setNodes(cloneNodes(DEFAULT_NODES));
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
        },
        setCurrentNode(id) {
            setCurrentNode(id);
            return nodes[id];
        },
        getNodesNames() {
            const res = [];
            $.each(nodes, function (id, node) {
                res.push({id, name: node.name});
            });
            return res;
        },
        removeNode(id) {
            if (Object.keys(nodes).length < 2) {
                throw 'Can\'t remove last node';
            }
            const newNodes = cloneNodes(nodes);
            delete newNodes[id];
            setNodes(newNodes);
            const newNodeId = Object.keys(nodes)[0];
            setCurrentNode(newNodeId);
            const newCurrentNode = nodes[newNodeId];
            return {
                id: newNodeId,
                node: newCurrentNode
            };
        }
    };
})();
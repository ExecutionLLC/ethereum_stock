const Nodes = (() => {
    let nodes = null;
    let currentNodeId = null;

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
        },
        Node3: {
            name: 'igor-out',
            url: 'http://37.195.64.171:2080/ethnode0',
            chainId: 15
        },
        Node4: {
            name: 'dima-out',
            url: 'http://37.195.64.171:2080/ethnode1',
            chainId: 15
        }
    };
    const DEFAULT_NODE_ID = 'Node3';

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

    function setCurrentNodeId(id) {
        currentNodeId = id;
        Storage.storeCurrent(id);
    }

    function cloneNodes(nodes) {
        return Object.assign(
            Object.create(null),
            nodes
        );
    }

    function generateNodeId() {
        // maybe generate uuid
        return '' + Math.random();
    }

    function nodesCount() {
        return Object.keys(nodes).length;
    }

    function isRONode(id) {
        return !!DEFAULT_NODES[id];
    }

    function canRemoveNode(id) {
        return nodesCount() >= 2 && !isRONode(id);
    }

    function init() {
        nodes = Storage.fetchNodes();
        if (!nodes || !Object.keys(nodes).length) {
            setNodes(cloneNodes(DEFAULT_NODES));
        }
        nodes = Object.assign({}, nodes, DEFAULT_NODES);
        currentNodeId = Storage.fetchCurrent();
        if (currentNodeId == null || !nodes[currentNodeId]) {
            if (nodes[DEFAULT_NODE_ID]) {
                setCurrentNodeId(DEFAULT_NODE_ID);
            } else {
                setCurrentNodeId(Object.keys(nodes)[0])
            }
        }
    }

    init();

    return {
        getCurrentNode() {
            return nodes[currentNodeId];
        },
        getCurrentNodeId() {
            return currentNodeId;
        },
        setCurrentNodeId(id) {
            setCurrentNodeId(id);
            return nodes[id];
        },
        getNodesNames() {
            const res = [];
            $.each(nodes, function (id, node) {
                res.push({id, name: node.name});
            });
            return res;
        },
        canRemoveNode(id) {
            return canRemoveNode(id);
        },
        removeNode(id) {
            if (!canRemoveNode(id)) {
                throw `Can't remove node id ${id}`;
            }
            const newNodes = cloneNodes(nodes);
            delete newNodes[id];
            setNodes(newNodes);
            const newNodeId = Object.keys(nodes)[0];
            setCurrentNodeId(newNodeId);
            const newCurrentNode = nodes[newNodeId];
            return {
                id: newNodeId,
                node: newCurrentNode
            };
        },
        addNode(node) {
            const id = generateNodeId();
            const newNodes = cloneNodes(nodes);
            newNodes[id] = node;
            setNodes(newNodes);
            setCurrentNodeId(id);
            return id;
        }
    };
})();

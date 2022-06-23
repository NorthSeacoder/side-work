const PreOrder = 'PreOrder';
const PostOrder = 'PostOrder';

const genTraverseTreeListFunc = order => (treeList, handle) => {
    const rec = (node, parent) => {
        if (order === PreOrder) handle(node, parent);

        if (node.children && node.children.length > 0) {
            node.children.forEach(element => rec(element, node));
        }

        if (order === PostOrder) handle(node, parent);
    };

    treeList.forEach(node => rec(node, null));

    return treeList;
};

export const preOrderTreeList = genTraverseTreeListFunc(PreOrder);

export const postOrderTreeList = genTraverseTreeListFunc(PostOrder);

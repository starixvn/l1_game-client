const mockFuntions = {
    createNodeFromPrefab: () => {},
    mockGameUtils: () => ({
        default: class {
            public static createNodeFromPrefab() {
                return mockFuntions.createNodeFromPrefab();
            }
        }
    })
};

export { mockFuntions };

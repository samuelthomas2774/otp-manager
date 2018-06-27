
export class SidebarSection {
    constructor(name) {
        this.name = name;
        this.items = [];
    }

    addItem(item, ...args) {
        if (!(item instanceof SidebarItem)) item = new SidebarItem(item, ...args);
        this.items.push(item);
        return item;
    }
}

export class SidebarItem {
    constructor(name, component) {
        this.name = name;
        this.component = component;
    }
}

export default class Sidebar {

    constructor() {
        this.sections = [];
        this.activeItem = undefined;
    }

    addSection(section) {
        if (!(section instanceof SidebarSection)) section = new SidebarSection(section);
        this.sections.push(section);
        return section;
    }

}

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with lucide-react
const files = execSync('grep -rl "from \\"lucide-react\\"" src/').toString().trim().split('\n');

const iconMap = {
    LayoutDashboard: 'Category',
    Users: 'Profile2User',
    AlertTriangle: 'Warning2',
    MessageSquare: 'Message',
    BarChart2: 'Chart',
    Settings: 'Setting2',
    HelpCircle: 'MessageQuestion',
    Activity: 'Activity',
    Search: 'SearchNormal1',
    Zap: 'Flash',
    ChevronLeft: 'ArrowLeft2',
    ChevronRight: 'ArrowRight2',
    MoreHorizontal: 'More',
    User: 'User',
    UserPlus: 'UserAdd',
    UserCheck: 'UserTick',
    LogOut: 'Logout',
    Shield: 'ShieldTick',
    CreditCard: 'Card',
    Bell: 'Notification',
    CheckCircle2: 'TickCircle',
    Check: 'TickCircle',
    X: 'Add', // Rotate 45deg
    Send: 'Send2',
    MoreVertical: 'More',
    Phone: 'Call',
    Video: 'Video',
    Image: 'Image',
    Paperclip: 'Paperclip2',
    Smile: 'Happyemoji',
    Circle: 'Record',
    TrendingUp: 'TrendUp',
    Download: 'DocumentDownload',
    ArrowUpRight: 'ArrowUp2',
    ArrowDownRight: 'ArrowDown2',
    Share2: 'Share',
    Smartphone: 'Mobile',
    Clock: 'Clock',
    Timer: 'Timer1',
    Flame: 'Flash',
    Dumbbell: 'Weight',
    Target: 'Radar',
    Footprints: 'TagRight', // Placeholder
    Mail: 'Sms',
    Link: 'Link21',
    Calendar: 'Calendar1',
    MapPin: 'Location',
    // Aliases
    ImageIcon: 'Image'
};

files.forEach(file => {
    if (!file) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Find lucide imports
    const importRegex = /import\s+{([^}]+)}\s+from\s+["']lucide-react["'];/g;
    let match;
    let newContent = content;
    
    while ((match = importRegex.exec(content)) !== null) {
        const importBlock = match[0];
        const iconsStr = match[1];
        const icons = iconsStr.split(',').map(i => i.trim()).filter(i => i);
        
        const iconsaxImports = new Set();
        
        icons.forEach(iconDef => {
            let iconName = iconDef;
            let aliasName = iconDef;
            
            if (iconDef.includes(' as ')) {
                const parts = iconDef.split(' as ');
                iconName = parts[0].trim();
                aliasName = parts[1].trim();
            }
            
            const saxIcon = iconMap[iconName] || iconName;
            
            if (aliasName !== iconName && saxIcon !== aliasName) {
                iconsaxImports.add(`${saxIcon} as ${aliasName}`);
            } else {
                iconsaxImports.add(saxIcon);
            }
            
            // For X icon, we replace the component if we used Add
            if (iconName === 'X') {
                newContent = newContent.replace(/<X\s/g, '<Add style={{transform: "rotate(45deg)"}} ');
            }
        });
        
        const newImport = `import { ${Array.from(iconsaxImports).join(', ')} } from "iconsax-react";`;
        newContent = newContent.replace(importBlock, newImport);
    }
    
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
});

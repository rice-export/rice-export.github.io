// ==========================================
// ADMIN DASHBOARD MODULE
// ==========================================

/**
 * Admin Dashboard State
 */
let adminDashboardState = {
    orders: [],
    filters: 'all',
    currentPage: 1,
    itemsPerPage: 4,
    selectedOrder: null
};

/**
 * Initialize sample order data
 */
function initializeOrderData() {
    adminDashboardState.orders = [
        {
            id: '#HE-2024-0891',
            consignee: 'Dubai Culinary Hub LLC',
            variety: 'Long Grain Basmati',
            tonnage: '450 MT',
            portOfDischarge: 'Jebel Ali, UAE',
            status: 'Processing',
            statusColor: '#fed7c0',
            date: '2024-10-12',
            amount: '$562,500',
            tracking: 'HTG-2024-X891-UAE'
        },
        {
            id: '#HE-2024-0888',
            consignee: 'Royal Thai Distribution',
            variety: 'Sona Masuri',
            tonnage: '1,200 MT',
            portOfDischarge: 'Bangkok, Thailand',
            status: 'Shipped',
            statusColor: '#90EE90',
            date: '2024-10-10',
            amount: '$1,140,000',
            tracking: 'HTG-2024-X888-TH'
        },
        {
            id: '#HE-2024-0895',
            consignee: 'Marseille Port Authority',
            variety: 'Premium Parboiled',
            tonnage: '800 MT',
            portOfDischarge: 'Marseille, France',
            status: 'Quoted',
            statusColor: '#FFD700',
            date: '2024-10-08',
            amount: '$760,000',
            tracking: 'HTG-2024-X895-FR'
        },
        {
            id: '#HE-2024-0899',
            consignee: 'Nordic Grain Import',
            variety: 'Golden Sella',
            tonnage: '350 MT',
            portOfDischarge: 'Rotterdam, Netherlands',
            status: 'Pending',
            statusColor: '#FFB6C6',
            date: '2024-10-05',
            amount: '$385,000',
            tracking: 'HTG-2024-X899-NL'
        },
        {
            id: '#HE-2024-0902',
            consignee: 'Singapore Trade Corp',
            variety: 'Jasmine Long Grain',
            tonnage: '600 MT',
            portOfDischarge: 'Port of Singapore',
            status: 'Packed',
            statusColor: '#87CEEB',
            date: '2024-10-03',
            amount: '$660,000',
            tracking: 'HTG-2024-X902-SG'
        }
    ];
}

/**
 * Initialize admin dashboard page
 */
function initAdminDashboard() {
    if (!adminDashboardState.orders.length) {
        initializeOrderData();
    }
    
    renderAdminDashboard();
    attachAdminEventListeners();
}

/**
 * Render admin dashboard
 */
function renderAdminDashboard() {
    const page = document.getElementById('admin-dashboard-page');
    if (!page) return;

    // Filter orders
    let filteredOrders = adminDashboardState.orders;
    if (adminDashboardState.filters !== 'all') {
        filteredOrders = adminDashboardState.orders.filter(order => 
            order.status.toLowerCase() === adminDashboardState.filters.toLowerCase()
        );
    }

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / adminDashboardState.itemsPerPage);
    const startIndex = (adminDashboardState.currentPage - 1) * adminDashboardState.itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + adminDashboardState.itemsPerPage);

    // Calculate statistics
    const totalVolume = adminDashboardState.orders.reduce((sum, order) => {
        const tons = parseInt(order.tonnage);
        return sum + tons;
    }, 0);

    const pendingQuotes = adminDashboardState.orders.filter(o => o.status === 'Pending' || o.status === 'Quoted').length;
    const processingOrders = adminDashboardState.orders.filter(o => o.status === 'Processing' || o.status === 'Packed').length;

    // Regional distribution
    const regionData = {
        'Middle East': 42,
        'Europe': 28,
        'Southeast Asia': 18,
        'Others': 12
    };

    let html = `
        <div style="max-width: 1280px; margin: 0 auto; padding: 2rem;">
            <!-- Hero Header Section -->
            <div style="margin-bottom: 3rem; display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: end;">
                <div>
                    <h1 style="font-family: 'Noto Serif', serif; font-size: 36px; color: #944600; margin-bottom: 0.5rem;">Institutional Dashboard</h1>
                    <p style="font-size: 16px; color: #6b5147; max-width: 600px;">Managing the gold of the earth with precision. Oversee global shipments, maintain inventory integrity, and track the legacy of our finest harvests.</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 12px; color: #8b7355; text-transform: uppercase; margin-bottom: 0.5rem;">Current Harvest Season</p>
                    <p style="font-family: 'Noto Serif', serif; font-size: 24px; font-weight: 600; color: #944600;">Kharif 2024</p>
                </div>
            </div>

            <!-- Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                <div style="background: white; border: 1px solid #e8ddd5; padding: 2rem; border-radius: 0.25rem;">
                    <p style="font-size: 12px; color: #8b7355; text-transform: uppercase; margin-bottom: 0.5rem;">Total Export Volume</p>
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 32px; color: #944600; margin-bottom: 0.5rem;">${totalVolume.toLocaleString()} <span style="font-size: 16px;">MT</span></h3>
                    <p style="font-size: 12px; color: #6b5147;">+12.4% from previous quarter</p>
                </div>
                <div style="background: white; border: 1px solid #e8ddd5; padding: 2rem; border-radius: 0.25rem;">
                    <p style="font-size: 12px; color: #8b7355; text-transform: uppercase; margin-bottom: 0.5rem;">Pending Quotes</p>
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 32px; color: #944600; margin-bottom: 0.5rem;">${pendingQuotes}</h3>
                    <a onclick="filterAdminOrders('pending')" style="cursor: pointer; font-size: 12px; color: #944600; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">Review Requests →</a>
                </div>
                <div style="background: white; border: 1px solid #e8ddd5; padding: 2rem; border-radius: 0.25rem;">
                    <p style="font-size: 12px; color: #8b7355; text-transform: uppercase; margin-bottom: 0.5rem;">Processing Orders</p>
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 32px; color: #944600; margin-bottom: 0.5rem;">${processingOrders}</h3>
                    <a onclick="filterAdminOrders('processing')" style="cursor: pointer; font-size: 12px; color: #944600; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">View Pipeline →</a>
                </div>
            </div>

            <!-- Orders Management Section -->
            <div style="background: white; border: 1px solid #e8ddd5; border-radius: 0.25rem;">
                <!-- Header -->
                <div style="border-bottom: 1px solid #e8ddd5; padding: 1.5rem 2rem; display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center;">
                    <h2 style="font-family: 'Noto Serif', serif; font-size: 24px; color: #944600;">Recent Export Orders</h2>
                    <!-- Filter Buttons -->
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end;">
                        <button onclick="filterAdminOrders('all')" style="padding: 0.5rem 1rem; font-size: 12px; font-weight: 600; text-transform: uppercase; border: 1px solid #944600; background-color: ${adminDashboardState.filters === 'all' ? '#944600' : 'white'}; color: ${adminDashboardState.filters === 'all' ? 'white' : '#944600'}; cursor: pointer; transition: all 0.3s; border-radius: 0.125rem;">All Orders</button>
                        <button onclick="filterAdminOrders('pending')" style="padding: 0.5rem 1rem; font-size: 12px; font-weight: 600; text-transform: uppercase; border: 1px solid #e8ddd5; background-color: ${adminDashboardState.filters === 'pending' ? '#944600' : 'white'}; color: ${adminDashboardState.filters === 'pending' ? 'white' : '#6b5147'}; cursor: pointer; transition: all 0.3s; border-radius: 0.125rem;">Pending</button>
                        <button onclick="filterAdminOrders('quoted')" style="padding: 0.5rem 1rem; font-size: 12px; font-weight: 600; text-transform: uppercase; border: 1px solid #e8ddd5; background-color: ${adminDashboardState.filters === 'quoted' ? '#944600' : 'white'}; color: ${adminDashboardState.filters === 'quoted' ? 'white' : '#6b5147'}; cursor: pointer; transition: all 0.3s; border-radius: 0.125rem;">Quoted</button>
                        <button onclick="filterAdminOrders('processing')" style="padding: 0.5rem 1rem; font-size: 12px; font-weight: 600; text-transform: uppercase; border: 1px solid #e8ddd5; background-color: ${adminDashboardState.filters === 'processing' ? '#944600' : 'white'}; color: ${adminDashboardState.filters === 'processing' ? 'white' : '#6b5147'}; cursor: pointer; transition: all 0.3s; border-radius: 0.125rem;">Processing</button>
                        <button onclick="filterAdminOrders('shipped')" style="padding: 0.5rem 1rem; font-size: 12px; font-weight: 600; text-transform: uppercase; border: 1px solid #e8ddd5; background-color: ${adminDashboardState.filters === 'shipped' ? '#944600' : 'white'}; color: ${adminDashboardState.filters === 'shipped' ? 'white' : '#6b5147'}; cursor: pointer; transition: all 0.3s; border-radius: 0.125rem;">Shipped</button>
                    </div>
                </div>

                <!-- Table -->
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #8b7355; color: white;">
                                <th style="padding: 1rem; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Order ID</th>
                                <th style="padding: 1rem; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Consignee</th>
                                <th style="padding: 1rem; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Variety</th>
                                <th style="padding: 1rem; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Tonnage</th>
                                <th style="padding: 1rem; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Port of Discharge</th>
                                <th style="padding: 1rem; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                                <th style="padding: 1rem; text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedOrders.map((order, index) => `
                                <tr style="border-bottom: 1px solid #e8ddd5; background-color: ${index % 2 === 0 ? 'white' : '#f9f9f7'}; transition: background-color 0.2s;">
                                    <td style="padding: 1rem; font-family: 'Courier New', monospace; font-size: 14px; color: #944600; font-weight: 600;">${order.id}</td>
                                    <td style="padding: 1rem; font-size: 14px; color: #3d2817;">${order.consignee}</td>
                                    <td style="padding: 1rem; font-size: 14px; color: #6b5147;">${order.variety}</td>
                                    <td style="padding: 1rem; font-size: 14px; color: #6b5147;">${order.tonnage}</td>
                                    <td style="padding: 1rem; font-size: 14px; color: #6b5147;">${order.portOfDischarge}</td>
                                    <td style="padding: 1rem;">
                                        <span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: ${order.statusColor}; color: ${order.status === 'Shipped' ? 'white' : '#3d2817'}; border-radius: 1rem; font-size: 12px; font-weight: 600;">${order.status}</span>
                                    </td>
                                    <td style="padding: 1rem; text-align: center;">
                                        <button onclick="viewAdminOrder('${order.id}')" style="background: none; border: none; color: #944600; cursor: pointer; font-size: 12px; font-weight: 600; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.textDecoration='underline'; this.style.color='#6b3300'" onmouseout="this.style.textDecoration='none'; this.style.color='#944600'">View</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div style="border-top: 1px solid #e8ddd5; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; background-color: #f9f9f7;">
                    <p style="font-size: 12px; color: #8b7355;">Showing ${paginatedOrders.length} of ${filteredOrders.length} orders</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="previousAdminPage()" style="padding: 0.5rem 0.75rem; border: 1px solid #e8ddd5; background: white; cursor: pointer; border-radius: 0.125rem;">←</button>
                        ${Array.from({length: totalPages}, (_, i) => `
                            <button onclick="goToAdminPage(${i + 1})" style="padding: 0.5rem 0.75rem; border: 1px solid ${adminDashboardState.currentPage === i + 1 ? '#944600' : '#e8ddd5'}; background: ${adminDashboardState.currentPage === i + 1 ? '#944600' : 'white'}; color: ${adminDashboardState.currentPage === i + 1 ? 'white' : '#3d2817'}; cursor: pointer; border-radius: 0.125rem;">${i + 1}</button>
                        `).join('')}
                        <button onclick="nextAdminPage()" style="padding: 0.5rem 0.75rem; border: 1px solid #e8ddd5; background: white; cursor: pointer; border-radius: 0.125rem;">→</button>
                    </div>
                </div>
            </div>

            <!-- Regional Distribution -->
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; margin-top: 2rem;">
                <div style="background: white; border: 1px solid #e8ddd5; padding: 2rem; border-radius: 0.25rem;">
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 20px; color: #944600; margin-bottom: 1.5rem;">Port Distribution</h3>
                    ${Object.entries(regionData).map(([region, percentage]) => `
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="font-size: 14px; color: #6b5147;">${region}</span>
                                <span style="font-weight: 600; color: #944600;">${percentage}%</span>
                            </div>
                            <div style="background: #e8ddd5; height: 6px; border-radius: 2px; overflow: hidden;">
                                <div style="background: #944600; height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="background: white; border: 1px solid #e8ddd5; padding: 2rem; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdVSmQHBKvt3lwxB6XJ7tzsqHmL9D5MPWVRnhhAoF1tqCyxoMUWx1JQtvHWH4WoSUqEtcZa0S7f1xntjGug87H2CXZR-UxDkjhURFt7tAE565wEuuc5rhCfBVkGsi3OSEWM0ow3JG142DiFKxjOdR5yB7O-pWj4ofx3qM2kInT_4L8eabFzClmum33ZgTrDGInK4pzpcKNevlYZTPDIFyFGGzgs7FaHe8Fmr7o7d4BGiHa3ekr2nm89CR-kzOjQLHWx8y4ZBDGcfH3" alt="Global Logistics" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 0.25rem;"/>
                </div>
            </div>
        </div>
    `;

    page.innerHTML = html;
}

/**
 * Filter orders
 */
function filterAdminOrders(filter) {
    adminDashboardState.filters = filter;
    adminDashboardState.currentPage = 1;
    renderAdminDashboard();
}

/**
 * View order details
 */
function viewAdminOrder(orderId) {
    const order = adminDashboardState.orders.find(o => o.id === orderId);
    if (!order) return;

    adminDashboardState.selectedOrder = order;
    
    // Show modal or navigate to tracking
    navigateTo('export-tracking');
}

/**
 * Pagination controls
 */
function goToAdminPage(page) {
    adminDashboardState.currentPage = page;
    renderAdminDashboard();
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function previousAdminPage() {
    if (adminDashboardState.currentPage > 1) {
        adminDashboardState.currentPage--;
        renderAdminDashboard();
    }
}

function nextAdminPage() {
    const filteredOrders = adminDashboardState.filters === 'all' 
        ? adminDashboardState.orders 
        : adminDashboardState.orders.filter(o => o.status.toLowerCase() === adminDashboardState.filters.toLowerCase());
    
    const totalPages = Math.ceil(filteredOrders.length / adminDashboardState.itemsPerPage);
    if (adminDashboardState.currentPage < totalPages) {
        adminDashboardState.currentPage++;
        renderAdminDashboard();
    }
}

/**
 * Attach event listeners
 */
function attachAdminEventListeners() {
    // Event listeners are attached inline in the render function
}

// Initialize on page load
window.addEventListener('load', () => {
    if (appState && appState.currentPage === 'admin-dashboard') {
        initAdminDashboard();
    }
});

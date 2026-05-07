// ==========================================
// EXPORT TRACKING MODULE
// ==========================================

/**
 * Export Tracking State
 */
let exportTrackingState = {
    trackingData: {},
    searchInput: '',
    allShipments: []
};

/**
 * Initialize tracking data
 */
function initializeTrackingData() {
    exportTrackingState.allShipments = [
        {
            id: 'HTG-2024-X892-IND',
            orderId: '#HE-2024-0891',
            variety: 'Long Grain Basmati',
            tonnage: '450 MT',
            consignee: 'Dubai Culinary Hub LLC',
            portOfDischarge: 'Jebel Ali, UAE',
            vessel: 'Heritage Sovereign',
            currentStatus: 'IN TRANSIT',
            currentPosition: 'Arabian Sea',
            eta: '02 NOV 2024',
            timeline: [
                { step: 'Order Received', location: 'Karnal Export Hub, India', date: '12 OCT 2024', status: 'COMPLETED', icon: 'check_circle' },
                { step: 'Quality Check', location: 'ISO 22000 Heritage Certification Lab', date: '14 OCT 2024', status: 'COMPLETED', notes: 'Batch HTG-99 passed premium moisture parameters', icon: 'verified' },
                { step: 'Packed & Sealed', location: 'Climate-Controlled Packing Unit C', date: '15 OCT 2024', status: 'COMPLETED', icon: 'local_shipping' },
                { step: 'On Vessel', location: 'Port of Mundra - Vessel: Heritage Sovereign', date: '18 OCT 2024', status: 'IN TRANSIT', currentPosition: 'Arabian Sea', icon: 'directions_boat' },
                { step: 'At Destination', location: 'Port of Rotterdam, Netherlands', date: 'ETA 02 NOV', status: 'PENDING', icon: 'location_on' }
            ],
            containerDetails: {
                id: 'MSCU-7821095',
                seal: 'GTH-77218',
                weight: '24,000 KG',
                temp: '18°C (Constant)'
            },
            documents: [
                { name: 'Bill of Lading', size: '1.2 MB', type: 'PDF' },
                { name: 'Phytosanitary Certificate', size: '850 KB', type: 'PDF' },
                { name: 'Certificate of Origin', size: '450 KB', type: 'PDF' }
            ]
        },
        {
            id: 'HTG-2024-X888-TH',
            orderId: '#HE-2024-0888',
            variety: 'Sona Masuri',
            tonnage: '1,200 MT',
            consignee: 'Royal Thai Distribution',
            portOfDischarge: 'Bangkok, Thailand',
            vessel: 'Ocean Victory',
            currentStatus: 'DELIVERED',
            currentPosition: 'Port of Bangkok',
            eta: 'DELIVERED 28 OCT 2024',
            timeline: [
                { step: 'Order Received', location: 'Karnal Export Hub, India', date: '01 OCT 2024', status: 'COMPLETED', icon: 'check_circle' },
                { step: 'Quality Check', location: 'ISO 22000 Heritage Certification Lab', date: '03 OCT 2024', status: 'COMPLETED', icon: 'verified' },
                { step: 'Packed & Sealed', location: 'Climate-Controlled Packing Unit A', date: '05 OCT 2024', status: 'COMPLETED', icon: 'local_shipping' },
                { step: 'On Vessel', location: 'Port of Mundra - Vessel: Ocean Victory', date: '08 OCT 2024', status: 'COMPLETED', icon: 'directions_boat' },
                { step: 'At Destination', location: 'Port of Bangkok, Thailand', date: '28 OCT 2024', status: 'COMPLETED', icon: 'location_on' }
            ],
            containerDetails: {
                id: 'TEMU-9124789',
                seal: 'OV-12456',
                weight: '36,000 KG',
                temp: '18°C (Constant)'
            },
            documents: [
                { name: 'Bill of Lading', size: '1.1 MB', type: 'PDF' },
                { name: 'Phytosanitary Certificate', size: '920 KB', type: 'PDF' },
                { name: 'Certificate of Origin', size: '520 KB', type: 'PDF' }
            ]
        },
        {
            id: 'HTG-2024-X895-FR',
            orderId: '#HE-2024-0895',
            variety: 'Premium Parboiled',
            tonnage: '800 MT',
            consignee: 'Marseille Port Authority',
            portOfDischarge: 'Marseille, France',
            vessel: 'Euro Star',
            currentStatus: 'PENDING',
            currentPosition: 'Quote Phase',
            eta: 'TBD',
            timeline: [
                { step: 'Quote Sent', location: 'Karnal Export Hub, India', date: '20 OCT 2024', status: 'COMPLETED', icon: 'mail' },
                { step: 'Payment Pending', location: 'Awaiting L/C or Wire Transfer', date: 'Pending', status: 'PENDING', icon: 'payments' },
                { step: 'Quality Check', location: 'ISO 22000 Heritage Certification Lab', date: 'TBD', status: 'PENDING', icon: 'verified' },
                { step: 'Shipping', location: 'Port of Mundra', date: 'TBD', status: 'PENDING', icon: 'local_shipping' },
                { step: 'Delivery', location: 'Port of Marseille, France', date: 'TBD', status: 'PENDING', icon: 'location_on' }
            ],
            containerDetails: {},
            documents: []
        }
    ];

    // Initialize default tracking data (first shipment)
    exportTrackingState.trackingData = exportTrackingState.allShipments[0];
}

/**
 * Initialize export tracking page
 */
function initExportTracking() {
    if (!exportTrackingState.allShipments.length) {
        initializeTrackingData();
    }
    
    renderExportTracking();
    attachTrackingEventListeners();
}

/**
 * Render export tracking page
 */
function renderExportTracking() {
    const page = document.getElementById('export-tracking-page');
    if (!page) return;

    const tracking = exportTrackingState.trackingData;
    if (!tracking || !tracking.id) {
        initializeTrackingData();
        exportTrackingState.trackingData = exportTrackingState.allShipments[0];
    }

    const statusColor = {
        'IN TRANSIT': '#944600',
        'DELIVERED': '#90EE90',
        'PENDING': '#FFB6C6',
        'COMPLETED': '#90EE90'
    };

    let html = `
        <div style="max-width: 1280px; margin: 0 auto; padding: 2rem;">
            <!-- Header Section -->
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 2rem; margin-bottom: 2rem; align-items: end;">
                <div>
                    <h1 style="font-family: 'Noto Serif', serif; font-size: 36px; color: #944600; margin-bottom: 0.5rem;">Shipment Tracking</h1>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem;">
                        <span style="font-size: 12px; color: #8b7355; text-transform: uppercase;">Consignment ID:</span>
                        <span style="font-family: 'Courier New', monospace; font-size: 14px; color: #3d2817; background: #f0e8e2; padding: 0.25rem 0.75rem; border: 1px solid #e8ddd5;">${tracking.id}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 12px; color: #8b7355; text-transform: uppercase; margin-bottom: 0.5rem;">Current Vessel Status</p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end;">
                        <span class="material-symbols-outlined" style="font-size: 28px; color: #944600;">directions_boat</span>
                        <p style="font-family: 'Noto Serif', serif; font-size: 24px; font-weight: 600; color: #944600;">${tracking.currentStatus}</p>
                    </div>
                </div>
            </div>

            <!-- Search Box -->
            <div style="background: white; border: 1px solid #e8ddd5; padding: 1.5rem 2rem; border-radius: 0.25rem; margin-bottom: 2rem;">
                <label style="display: block; font-size: 12px; color: #8b7355; text-transform: uppercase; margin-bottom: 0.5rem;">Search another shipment</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="tracking-search" placeholder="Enter tracking ID (e.g., HTG-2024-X892-IND)" style="flex: 1; padding: 0.75rem; border: 1px solid #e8ddd5; border-radius: 0.125rem; font-size: 14px;" onkeypress="handleTrackingSearch(event)"/>
                    <button onclick="searchTracking()" style="padding: 0.75rem 1.5rem; background: #944600; color: white; border: none; cursor: pointer; border-radius: 0.125rem; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.backgroundColor='#6b3300'" onmouseout="this.style.backgroundColor='#944600'">Search</button>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                <!-- Left: Timeline -->
                <div style="background: white; border: 1px solid #e8ddd5; padding: 2rem; border-radius: 0.25rem;">
                    <h3 style="font-family: 'Noto Serif', serif; font-size: 20px; color: #8b7355; margin-bottom: 2rem;">Export Journey</h3>
                    
                    <!-- Timeline -->
                    <div style="position: relative; padding-left: 2rem;">
                        <!-- Vertical line -->
                        <div style="position: absolute; left: 0.5rem; top: 1rem; bottom: 0; width: 2px; background: #e8ddd5;"></div>

                        <!-- Timeline items -->
                        ${tracking.timeline.map((item, index) => `
                            <div style="margin-bottom: 2rem; position: relative;">
                                <!-- Circle -->
                                <div style="position: absolute; left: -1.65rem; top: 0.25rem; width: 1.5rem; height: 1.5rem; background: ${item.status === 'COMPLETED' ? '#944600' : item.status === 'IN TRANSIT' ? 'white' : '#e8ddd5'}; border: 3px solid ${item.status === 'COMPLETED' ? '#944600' : item.status === 'IN TRANSIT' ? '#944600' : '#e8ddd5'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1; transition: all 0.3s;">
                                    <span class="material-symbols-outlined" style="font-size: 12px; color: ${item.status === 'COMPLETED' ? 'white' : 'transparent'}; font-weight: 600;">check</span>
                                </div>

                                <!-- Content -->
                                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                    <div>
                                        <h4 style="font-weight: 600; color: ${item.status === 'COMPLETED' || item.status === 'IN TRANSIT' ? '#944600' : '#8b7355'}; margin-bottom: 0.25rem;">${item.step}</h4>
                                        <p style="font-size: 14px; color: #6b5147; margin-bottom: 0.5rem;">${item.location}</p>
                                        ${item.notes ? `<p style="font-size: 12px; color: #6b5147; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span class="material-symbols-outlined" style="font-size: 16px; color: #944600;">verified</span>${item.notes}</p>` : ''}
                                        ${item.currentPosition ? `<p style="font-size: 12px; background: #fed7c0; padding: 0.5rem; border-radius: 0.125rem; margin-top: 0.5rem;"><strong>Position:</strong> ${item.currentPosition}</p>` : ''}
                                    </div>
                                    <div style="text-align: right; white-space: nowrap;">
                                        <p style="font-family: 'Courier New', monospace; font-size: 12px; color: #6b5147; margin-bottom: 0.25rem;">${item.date}</p>
                                        <span style="display: inline-block; padding: 0.25rem 0.75rem; background-color: ${item.status === 'COMPLETED' ? '#e8ddd5' : item.status === 'IN TRANSIT' ? '#fed7c0' : '#f0f0f0'}; color: ${item.status === 'IN TRANSIT' ? '#944600' : '#8b7355'}; border-radius: 1rem; font-size: 11px; font-weight: 600; text-transform: uppercase;">${item.status}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Right Column -->
                <div style="display: flex; flex-direction: column; gap: 2rem;">
                    <!-- Container Details -->
                    <div style="background: white; border: 1px solid #e8ddd5; border-radius: 0.25rem; overflow: hidden;">
                        <!-- Image -->
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHv1xJMUajrZcPORHFVAspP4KDx9Vxl0x4n5CMGp59TTHrPJmh-LjTbdvI8joYTHpZ5D_wgJ0o6rIxB1yGKxPF2a_cfi4iFJWy2KLMNi5-aWDfg0ow5u0Jl9RIzl-gs1LEALX7IZTj93dnxSTV4n2UsUbmdjKxzqcYp3a3d6plr2AM2gYTarXoRWcHUkOnp29cYn2gDTpi3lOWSpc--G2vj11YfVmaY6S-_1ve-aWo841q5gqDgSOPxD8fRcvzlVLw4sRGEm2c-Cp7" alt="Container" style="width: 100%; height: 150px; object-fit: cover;"/>
                        
                        <!-- Details -->
                        <div style="padding: 1.5rem;">
                            <h4 style="font-family: 'Noto Serif', serif; font-size: 16px; color: #8b7355; margin-bottom: 1rem;">Container Details</h4>
                            <div style="space-y: 0.75rem;">
                                <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #e8ddd5;">
                                    <span style="font-size: 12px; color: #8b7355; text-transform: uppercase;">Container ID</span>
                                    <span style="font-weight: 600; color: #3d2817;">${tracking.containerDetails.id || 'N/A'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #e8ddd5;">
                                    <span style="font-size: 12px; color: #8b7355; text-transform: uppercase;">Seal Number</span>
                                    <span style="font-weight: 600; color: #3d2817;">${tracking.containerDetails.seal || 'N/A'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid #e8ddd5;">
                                    <span style="font-size: 12px; color: #8b7355; text-transform: uppercase;">Load Weight</span>
                                    <span style="font-weight: 600; color: #3d2817;">${tracking.containerDetails.weight || 'N/A'}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-size: 12px; color: #8b7355; text-transform: uppercase;">Temp Controls</span>
                                    <span style="font-weight: 600; color: #3d2817;">${tracking.containerDetails.temp || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Documents -->
                    ${tracking.documents && tracking.documents.length > 0 ? `
                        <div style="background: white; border: 1px solid #e8ddd5; padding: 1.5rem; border-radius: 0.25rem;">
                            <h4 style="font-family: 'Noto Serif', serif; font-size: 16px; color: #8b7355; margin-bottom: 1rem;">Trade Documentation</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                ${tracking.documents.map(doc => `
                                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: #f9f9f7; border: 1px solid #e8ddd5; border-radius: 0.125rem; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='#fed7c0'; this.style.borderColor='#944600'" onmouseout="this.style.backgroundColor='#f9f9f7'; this.style.borderColor='#e8ddd5'">
                                        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                                            <span class="material-symbols-outlined" style="color: #944600;">description</span>
                                            <div>
                                                <p style="font-weight: 600; font-size: 13px; color: #3d2817;">${doc.name}</p>
                                                <p style="font-size: 11px; color: #8b7355;">${doc.type} • ${doc.size}</p>
                                            </div>
                                        </div>
                                        <span class="material-symbols-outlined" style="color: #8b7355; cursor: pointer;">download</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Compliance Section -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                <div style="background: white; border: 1px solid #e8ddd5; padding: 1.5rem; text-align: center; border-radius: 0.25rem;">
                    <span class="material-symbols-outlined" style="font-size: 32px; color: #944600; display: block; margin-bottom: 0.5rem;">gavel</span>
                    <h5 style="font-weight: 600; color: #8b7355; margin-bottom: 0.25rem; text-transform: uppercase;">Customs Compliance</h5>
                    <p style="font-size: 12px; color: #6b5147;">EU Import Regulations 2024/01</p>
                </div>
                <div style="background: white; border: 1px solid #e8ddd5; padding: 1.5rem; text-align: center; border-radius: 0.25rem;">
                    <span class="material-symbols-outlined" style="font-size: 32px; color: #944600; display: block; margin-bottom: 0.5rem;">eco</span>
                    <h5 style="font-weight: 600; color: #8b7355; margin-bottom: 0.25rem; text-transform: uppercase;">Sustainable Export</h5>
                    <p style="font-size: 12px; color: #6b5147;">Ethically Sourced & Carbon Offset</p>
                </div>
                <div style="background: white; border: 1px solid #e8ddd5; padding: 1.5rem; text-align: center; border-radius: 0.25rem;">
                    <span class="material-symbols-outlined" style="font-size: 32px; color: #944600; display: block; margin-bottom: 0.5rem;">support_agent</span>
                    <h5 style="font-weight: 600; color: #8b7355; margin-bottom: 0.25rem; text-transform: uppercase;">Export Desk</h5>
                    <p style="font-size: 12px; color: #6b5147;">24/7 Global Institutional Support</p>
                </div>
            </div>
        </div>
    `;

    page.innerHTML = html;
}

/**
 * Search tracking
 */
function searchTracking() {
    const searchInput = document.getElementById('tracking-search');
    if (!searchInput) return;

    const trackingId = searchInput.value.trim().toUpperCase();
    if (!trackingId) {
        alert('Please enter a tracking ID');
        return;
    }

    const shipment = exportTrackingState.allShipments.find(s => s.id === trackingId);
    if (!shipment) {
        alert('Tracking ID not found. Please check and try again.');
        return;
    }

    exportTrackingState.trackingData = shipment;
    renderExportTracking();
    window.scrollTo({top: 0, behavior: 'smooth'});
}

/**
 * Handle tracking search on Enter key
 */
function handleTrackingSearch(event) {
    if (event.key === 'Enter') {
        searchTracking();
    }
}

/**
 * Attach event listeners
 */
function attachTrackingEventListeners() {
    // Event listeners are attached inline
}

// Initialize on page load
window.addEventListener('load', () => {
    if (appState && appState.currentPage === 'export-tracking') {
        initExportTracking();
    }
});

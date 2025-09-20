// Sistema Art Detail - Estética Automotiva
// Armazenamento local usando localStorage

class ArtDetailSystem {
    // Inicializar sistema quando a página carregar
    constructor() {
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupEventListeners();
        this.showPage('dashboard');
        this.updateDashboard();
        this.updateRelatorios();
    }

    // ===== GERENCIAMENTO DE DADOS =====
    
    // Clientes
    getClientes() {
        return JSON.parse(localStorage.getItem('artdetail_clientes') || '[]');
    }

    saveClientes(clientes) {
        localStorage.setItem('artdetail_clientes', JSON.stringify(clientes));
        this.updateDashboard();
    }

    addCliente(cliente) {
        const clientes = this.getClientes();
        cliente.id = this.generateId();
        cliente.createdAt = new Date().toISOString();
        clientes.push(cliente);
        this.saveClientes(clientes);
        return cliente;
    }

    updateCliente(id, clienteData) {
        const clientes = this.getClientes();
        const index = clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            clientes[index] = { ...clientes[index], ...clienteData };
            this.saveClientes(clientes);
            return clientes[index];
        }
        return null;
    }

    deleteCliente(id) {
        const clientes = this.getClientes();
        const filtered = clientes.filter(c => c.id !== id);
        this.saveClientes(filtered);
        
        // Também remove veículos do cliente
        const veiculos = this.getVeiculos();
        const veiculosFiltered = veiculos.filter(v => v.clienteId !== id);
        this.saveVeiculos(veiculosFiltered);
    }

    // Veículos
    getVeiculos() {
        return JSON.parse(localStorage.getItem('artdetail_veiculos') || '[]');
    }

    saveVeiculos(veiculos) {
        localStorage.setItem('artdetail_veiculos', JSON.stringify(veiculos));
        this.updateDashboard();
    }

    addVeiculo(veiculo) {
        const veiculos = this.getVeiculos();
        veiculo.id = this.generateId();
        veiculo.createdAt = new Date().toISOString();
        veiculo.placa = veiculo.placa.toUpperCase();
        veiculo.images = veiculo.images || [];
        veiculos.push(veiculo);
        this.saveVeiculos(veiculos);
        return veiculo;
    }

    updateVeiculo(id, veiculoData) {
        const veiculos = this.getVeiculos();
        const index = veiculos.findIndex(v => v.id === id);
        if (index !== -1) {
            if (veiculoData.placa) {
                veiculoData.placa = veiculoData.placa.toUpperCase();
            }
            veiculos[index] = { ...veiculos[index], ...veiculoData };
            this.saveVeiculos(veiculos);
            return veiculos[index];
        }
        return null;
    }

    deleteVeiculo(id) {
        const veiculos = this.getVeiculos();
        const filtered = veiculos.filter(v => v.id !== id);
        this.saveVeiculos(filtered);
    }

    // Serviços
    getServicos() {
        return JSON.parse(localStorage.getItem('artdetail_servicos') || '[]');
    }

    saveServicos(servicos) {
        localStorage.setItem('artdetail_servicos', JSON.stringify(servicos));
    }

    addServico(servico) {
        const servicos = this.getServicos();
        servico.id = this.generateId();
        servico.createdAt = new Date().toISOString();
        servico.active = true;
        servicos.push(servico);
        this.saveServicos(servicos);
        return servico;
    }

    updateServico(id, servicoData) {
        const servicos = this.getServicos();
        const index = servicos.findIndex(s => s.id === id);
        if (index !== -1) {
            servicos[index] = { ...servicos[index], ...servicoData };
            this.saveServicos(servicos);
            return servicos[index];
        }
        return null;
    }

    deleteServico(id) {
        const servicos = this.getServicos();
        const filtered = servicos.filter(s => s.id !== id);
        this.saveServicos(filtered);
    }

    // Agendamentos
    getAgendamentos() {
        return JSON.parse(localStorage.getItem('artdetail_agendamentos') || '[]');
    }

    saveAgendamentos(agendamentos) {
        localStorage.setItem('artdetail_agendamentos', JSON.stringify(agendamentos));
        this.updateDashboard();
    }

    addAgendamento(agendamento) {
        const agendamentos = this.getAgendamentos();
        agendamento.id = this.generateId();
        agendamento.createdAt = new Date().toISOString();
        agendamento.status = 'PENDING';
        agendamentos.push(agendamento);
        this.saveAgendamentos(agendamentos);
        return agendamento;
    }

    // Ordens de Serviço
    getOrdens() {
        return JSON.parse(localStorage.getItem('artdetail_ordens') || '[]');
    }

    saveOrdens(ordens) {
        localStorage.setItem('artdetail_ordens', JSON.stringify(ordens));
        this.updateDashboard();
    }

    addOrdem(ordem) {
        const ordens = this.getOrdens();
        ordem.id = this.generateId();
        ordem.numero = this.getNextOrderNumber();
        ordem.createdAt = new Date().toISOString();
        ordem.status = 'DRAFT';
        ordem.items = ordem.items || [];
        ordem.valor = 0;
        ordens.push(ordem);
        this.saveOrdens(ordens);
        return ordem;
    }

    getNextOrderNumber() {
        const ordens = this.getOrdens();
        const maxNumber = ordens.reduce((max, ordem) => Math.max(max, ordem.numero || 0), 0);
        return maxNumber + 1;
    }

    // Produtos (Estoque)
    getProdutos() {
        return JSON.parse(localStorage.getItem('artdetail_produtos') || '[]');
    }

    saveProdutos(produtos) {
        localStorage.setItem('artdetail_produtos', JSON.stringify(produtos));
    }

    addProduto(produto) {
        const produtos = this.getProdutos();
        produto.id = this.generateId();
        produto.createdAt = new Date().toISOString();
        produtos.push(produto);
        this.saveProdutos(produtos);
        return produto;
    }

    updateProduto(id, produtoData) {
        const produtos = this.getProdutos();
        const index = produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            produtos[index] = { ...produtos[index], ...produtoData };
            this.saveProdutos(produtos);
            return produtos[index];
        }
        return null;
    }

    deleteProduto(id) {
        const produtos = this.getProdutos();
        const filtered = produtos.filter(p => p.id !== id);
        this.saveProdutos(filtered);
    }

    getStockStatus(produto) {
        if (produto.quantidade === 0) return 'out';
        if (produto.quantidade <= produto.estoqueMinimo) return 'low';
        return 'ok';
    }

    // Utilitários
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('pt-BR');
    }

    // ===== INTERFACE =====

    setupEventListeners() {
        // Formulários
        document.getElementById('cliente-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleClienteSubmit(e);
        });

        document.getElementById('veiculo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleVeiculoSubmit(e);
        });

        document.getElementById('servico-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleServicoSubmit(e);
        });

        document.getElementById('produto-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const produto = {
                nome: formData.get('nome'),
                categoria: formData.get('categoria'),
                quantidade: parseInt(formData.get('quantidade')),
                estoqueMinimo: parseInt(formData.get('estoqueMinimo')),
                preco: parseFloat(formData.get('preco')),
                descricao: formData.get('descricao')
            };
            
            this.addProduto(produto);
            this.closeModal('produto-modal');
            e.target.reset();
            this.showNotification('Produto cadastrado com sucesso!', 'success');
        });

        document.getElementById('funcionario-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const funcionario = {
                nome: formData.get('nome'),
                cor: formData.get('cor')
            };
            
            this.addFuncionario(funcionario);
            this.closeModal('funcionario-modal');
            e.target.reset();
            this.showNotification('Funcionário cadastrado com sucesso!', 'success');
        });

        // Upload de imagens
        this.setupImageUpload();

        // Máscaras de input
        this.setupInputMasks();
    }

    setupImageUpload() {
        const imageInput = document.getElementById('veiculo-images');
        const uploadZone = document.querySelector('.upload-zone');
        const preview = document.getElementById('veiculo-image-preview');
        
        let selectedImages = [];

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--accent-cyan)';
            uploadZone.style.background = 'var(--hover-bg)';
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--border-color)';
            uploadZone.style.background = 'transparent';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--border-color)';
            uploadZone.style.background = 'transparent';
            
            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            this.handleImageFiles(files, selectedImages, preview);
        });

        // File input change
        imageInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleImageFiles(files, selectedImages, preview);
        });
    }

    handleImageFiles(files, selectedImages, preview) {
        files.forEach(file => {
            if (selectedImages.length >= 5) {
                this.showNotification('Máximo 5 imagens permitidas', 'warning');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                this.showNotification(`Imagem ${file.name} é muito grande (máx 2MB)`, 'warning');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    name: file.name,
                    data: e.target.result,
                    size: file.size
                };
                
                selectedImages.push(imageData);
                this.updateImagePreview(selectedImages, preview);
            };
            reader.readAsDataURL(file);
        });
    }

    updateImagePreview(images, preview) {
        preview.innerHTML = images.map((img, index) => `
            <div class="image-preview-item">
                <img src="${img.data}" alt="${img.name}">
                <button type="button" class="remove-btn" onclick="artDetail.removeImage(${index})">×</button>
            </div>
        `).join('');
    }

    removeImage(index) {
        const preview = document.getElementById('veiculo-image-preview');
        const images = Array.from(preview.children);
        images[index].remove();
    }

    setupInputMasks() {
        // Máscara para telefone
        document.addEventListener('input', (e) => {
            if (e.target.name === 'telefone') {
                e.target.value = this.maskPhone(e.target.value);
            }
            if (e.target.name === 'placa') {
                e.target.value = this.maskPlate(e.target.value);
            }
            if (e.target.name === 'documento') {
                e.target.value = this.maskDocument(e.target.value);
            }
        });
    }

    maskPhone(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        }
        return value;
    }

    maskPlate(value) {
        value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (value.length <= 7) {
            // Formato antigo: ABC-1234
            value = value.replace(/([A-Z]{3})([0-9]{1,4})/, '$1-$2');
        }
        return value;
    }

    maskDocument(value) {
        value = value.replace(/\D/g, '');
        if (value.length <= 11) {
            // CPF
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            // CNPJ
            value = value.replace(/(\d{2})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1/$2');
            value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }
        return value;
    }

    // Handlers de formulário
    handleClienteSubmit(e) {
        const formData = new FormData(e.target);
        const cliente = {
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            documento: formData.get('documento'),
            endereco: formData.get('endereco')
        };

        this.addCliente(cliente);
        this.closeModal('cliente-modal');
        this.renderClientes();
        this.showNotification('Cliente cadastrado com sucesso!', 'success');
        e.target.reset();
    }

    handleVeiculoSubmit(e) {
        const formData = new FormData(e.target);
        const veiculo = {
            clienteId: formData.get('clienteId'),
            placa: formData.get('placa'),
            marca: formData.get('marca'),
            modelo: formData.get('modelo'),
            cor: formData.get('cor'),
            ano: parseInt(formData.get('ano')) || null,
            images: this.getSelectedImages()
        };

        if (!veiculo.clienteId) {
            this.showNotification('Selecione um cliente!', 'error');
            return;
        }

        this.addVeiculo(veiculo);
        this.closeModal('veiculo-modal');
        this.renderVeiculos();
        this.showNotification('Veículo cadastrado com sucesso!', 'success');
        e.target.reset();
        this.clearImagePreview();
    }

    handleServicoSubmit(e) {
        const formData = new FormData(e.target);
        const servico = {
            nome: formData.get('nome'),
            descricao: formData.get('descricao'),
            preco: parseFloat(formData.get('preco')) || 0,
            duracao: parseInt(formData.get('duracao')) || 60
        };

        this.addServico(servico);
        this.closeModal('servico-modal');
        this.renderServicos();
        this.showNotification('Serviço cadastrado com sucesso!', 'success');
        e.target.reset();
    }

    getSelectedImages() {
        const preview = document.getElementById('veiculo-image-preview');
        const images = [];
        preview.querySelectorAll('img').forEach(img => {
            images.push({
                name: img.alt,
                data: img.src
            });
        });
        return images;
    }

    clearImagePreview() {
        const preview = document.getElementById('veiculo-image-preview');
        preview.innerHTML = '';
    }

    // Renderização das listas
    renderClientes() {
        const clientes = this.getClientes();
        const veiculos = this.getVeiculos();
        const tbody = document.getElementById('clientes-table');

        if (clientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Nenhum cliente cadastrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = clientes.map(cliente => {
            const clienteVeiculos = veiculos.filter(v => v.clienteId === cliente.id);
            return `
                <tr>
                    <td>${cliente.nome}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.email || '-'}</td>
                    <td>${clienteVeiculos.length}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="artDetail.editCliente('${cliente.id}')" style="padding: 0.5rem; margin-right: 0.5rem;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-secondary" onclick="artDetail.deleteCliente('${cliente.id}')" style="padding: 0.5rem; background: #EF4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderVeiculos() {
        const veiculos = this.getVeiculos();
        const clientes = this.getClientes();
        const tbody = document.getElementById('veiculos-table');

        if (veiculos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Nenhum veículo cadastrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = veiculos.map(veiculo => {
            const cliente = clientes.find(c => c.id === veiculo.clienteId);
            const hasImages = veiculo.images && veiculo.images.length > 0;
            return `
                <tr>
                    <td>
                        ${veiculo.placa}
                        ${hasImages ? `<br><small style="color: var(--accent-cyan);"><i class="fas fa-images"></i> ${veiculo.images.length} foto(s)</small>` : ''}
                    </td>
                    <td>${veiculo.marca} ${veiculo.modelo}</td>
                    <td>${cliente ? cliente.nome : 'Cliente não encontrado'}</td>
                    <td>${veiculo.cor || '-'}</td>
                    <td>${veiculo.ano || '-'}</td>
                    <td>
                        ${hasImages ? `<button class="btn btn-secondary" onclick="artDetail.viewVehicleImages('${veiculo.id}')" style="padding: 0.5rem; margin-right: 0.5rem;">
                            <i class="fas fa-images"></i>
                        </button>` : ''}
                        <button class="btn btn-secondary" onclick="artDetail.editVeiculo('${veiculo.id}')" style="padding: 0.5rem; margin-right: 0.5rem;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-secondary" onclick="artDetail.deleteVeiculo('${veiculo.id}')" style="padding: 0.5rem; background: #EF4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderServicos() {
        const servicos = this.getServicos();
        const tbody = document.getElementById('servicos-table');

        if (servicos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Nenhum serviço cadastrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = servicos.map(servico => {
            return `
                <tr>
                    <td>${servico.nome}</td>
                    <td>${servico.descricao || '-'}</td>
                    <td>${this.formatCurrency(servico.preco)}</td>
                    <td>${servico.duracao} min</td>
                    <td>
                        <span class="badge ${servico.active ? 'badge-success' : 'badge-danger'}">
                            ${servico.active ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-secondary" onclick="artDetail.editServico('${servico.id}')" style="padding: 0.5rem; margin-right: 0.5rem;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-secondary" onclick="artDetail.toggleServicoStatus('${servico.id}')" style="padding: 0.5rem; margin-right: 0.5rem;">
                            <i class="fas fa-toggle-${servico.active ? 'on' : 'off'}"></i>
                        </button>
                        <button class="btn btn-secondary" onclick="artDetail.deleteServico('${servico.id}')" style="padding: 0.5rem; background: #EF4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderProdutos() {
        const produtos = this.getProdutos();
        const tbody = document.getElementById('produtos-table');

        if (produtos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        Nenhum produto cadastrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = produtos.map(produto => {
            const stockStatus = this.getStockStatus(produto);
            const stockClass = `stock-${stockStatus}`;
            const stockText = stockStatus === 'out' ? 'Sem estoque' : 
                             stockStatus === 'low' ? 'Estoque baixo' : 'Estoque OK';
            
            return `
                <tr>
                    <td>${produto.nome}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.estoqueMinimo}</td>
                    <td>${this.formatCurrency(produto.preco)}</td>
                    <td>
                        <div class="stock-status">
                            <div class="stock-indicator ${stockClass}"></div>
                            ${stockText}
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-secondary" onclick="artDetail.editProduto('${produto.id}')" style="padding: 0.5rem; margin-right: 0.5rem;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-secondary" onclick="artDetail.adjustStock('${produto.id}')" style="padding: 0.5rem; margin-right: 0.5rem;">
                            <i class="fas fa-plus-minus"></i>
                        </button>
                        <button class="btn btn-secondary" onclick="artDetail.deleteProduto('${produto.id}')" style="padding: 0.5rem; background: #EF4444;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Atualizar select de clientes no modal de veículo
    updateClienteSelect() {
        const clientes = this.getClientes();
        const select = document.querySelector('[name="clienteId"]');
        
        select.innerHTML = '<option value="">Selecione um cliente</option>' +
            clientes.map(cliente => `<option value="${cliente.id}">${cliente.nome}</option>`).join('');
    }

    // Dashboard
    updateDashboard() {
        const clientes = this.getClientes();
        const veiculos = this.getVeiculos();
        const agendamentos = this.getAgendamentos();
        const ordens = this.getOrdens();

        // Atualizar contadores
        document.getElementById('total-clientes').textContent = clientes.length;
        document.getElementById('total-veiculos').textContent = veiculos.length;
        
        // Agendamentos de hoje
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentosHoje = agendamentos.filter(a => 
            a.scheduledAt && a.scheduledAt.startsWith(hoje)
        );
        document.getElementById('agendamentos-hoje').textContent = agendamentosHoje.length;

        // OS em andamento
        const osAbertas = ordens.filter(o => 
            ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED', 'IN_PROGRESS'].includes(o.status)
        );
        document.getElementById('os-abertas').textContent = osAbertas.length;

        // Renderizar agendamentos de hoje
        this.renderAgendamentosHoje(agendamentosHoje);
    }

    renderAgendamentosHoje(agendamentos) {
        const container = document.getElementById('agendamentos-hoje-lista');
        
        if (agendamentos.length === 0) {
            container.innerHTML = `
                <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
                    Nenhum agendamento para hoje
                </p>
            `;
            return;
        }

        const clientes = this.getClientes();
        const veiculos = this.getVeiculos();

        container.innerHTML = agendamentos.map(agendamento => {
            const cliente = clientes.find(c => c.id === agendamento.clienteId);
            const veiculo = veiculos.find(v => v.id === agendamento.vehicleId);
            
            return `
                <div style="padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${cliente ? cliente.nome : 'Cliente não encontrado'}</strong><br>
                        <small style="color: var(--text-secondary);">
                            ${veiculo ? `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}` : 'Veículo não encontrado'}
                        </small>
                    </div>
                    <div style="text-align: right;">
                        <div>${new Date(agendamento.scheduledAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</div>
                        <span class="badge badge-info">${agendamento.status}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Navegação
    showPage(pageName) {
        // Esconder todas as páginas
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.add('hidden');
        });

        // Mostrar a página selecionada
        const targetPage = document.getElementById(pageName + '-page');
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Atualizar dados baseado na página
        switch(pageName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'clientes':
                this.renderClientes();
                break;
            case 'veiculos':
                this.renderVeiculos();
                break;
            case 'servicos':
                this.renderServicos();
                break;
            case 'estoque':
                this.renderProdutos();
                break;
            case 'relatorios':
                this.updateRelatorios();
                break;
            case 'planos':
                this.renderPlanos();
                this.renderAssinaturas();
                break;
        }

        // Atualizar classe ativa no menu
        const menuItems = document.querySelectorAll('.sidebar-link');
        menuItems.forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`[onclick="showPage('${pageName}')"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Modais
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            
            // Atualizar select de clientes se for modal de veículo
            if (modalId === 'veiculo-modal') {
                this.updateClienteSelect();
            }
        } else {
            console.warn(`Modal ${modalId} não encontrado`);
            this.showNotification('Funcionalidade em desenvolvimento', 'info');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Ações de edição e exclusão
    editCliente(id) {
        // TODO: Implementar edição
        this.showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    deleteCliente(id) {
        if (confirm('Tem certeza que deseja excluir este cliente? Todos os veículos associados também serão removidos.')) {
            this.deleteCliente(id);
            this.renderClientes();
            this.showNotification('Cliente excluído com sucesso!', 'success');
        }
    }

    editVeiculo(id) {
        // TODO: Implementar edição
        this.showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    deleteVeiculo(id) {
        if (confirm('Tem certeza que deseja excluir este veículo?')) {
            this.deleteVeiculo(id);
            this.renderVeiculos();
            this.showNotification('Veículo excluído com sucesso!', 'success');
        }
    }

    editServico(id) {
        // TODO: Implementar edição
        this.showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    toggleServicoStatus(id) {
        const servico = this.getServicos().find(s => s.id === id);
        if (servico) {
            this.updateServico(id, { active: !servico.active });
            this.renderServicos();
            this.showNotification(`Serviço ${servico.active ? 'desativado' : 'ativado'} com sucesso!`, 'success');
        }
    }

    deleteServico(id) {
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            this.deleteServico(id);
            this.renderServicos();
            this.showNotification('Serviço excluído com sucesso!', 'success');
        }
    }

    // Ações para produtos
    editProduto(id) {
        this.showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    deleteProduto(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.deleteProduto(id);
            this.renderProdutos();
            this.showNotification('Produto excluído com sucesso!', 'success');
        }
    }

    adjustStock(id) {
        const produto = this.getProdutos().find(p => p.id === id);
        if (!produto) return;

        const adjustment = prompt(`Produto: ${produto.nome}\nEstoque atual: ${produto.quantidade}\n\nDigite a quantidade para ajustar (+ para adicionar, - para remover):`);
        
        if (adjustment === null) return;
        
        const value = parseInt(adjustment);
        if (isNaN(value)) {
            this.showNotification('Valor inválido!', 'error');
            return;
        }

        const newQuantity = produto.quantidade + value;
        if (newQuantity < 0) {
            this.showNotification('Estoque não pode ficar negativo!', 'error');
            return;
        }

        this.updateProduto(id, { quantidade: newQuantity });
        this.renderProdutos();
        this.showNotification(`Estoque ajustado! Nova quantidade: ${newQuantity}`, 'success');
    }

    viewVehicleImages(id) {
        const veiculo = this.getVeiculos().find(v => v.id === id);
        if (!veiculo || !veiculo.images || veiculo.images.length === 0) {
            this.showNotification('Nenhuma imagem encontrada para este veículo', 'info');
            return;
        }

        // Criar modal para visualizar imagens
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2 class="modal-title">Fotos do Veículo - ${veiculo.placa}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="vehicle-images">
                    ${veiculo.images.map(img => `
                        <div class="vehicle-image" onclick="this.requestFullscreen()">
                            <img src="${img.data}" alt="${img.name}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Remover modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Notificações
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // Definir cor baseada no tipo
        switch(type) {
            case 'success':
                notification.style.background = '#10B981';
                break;
            case 'error':
                notification.style.background = '#EF4444';
                break;
            case 'warning':
                notification.style.background = '#FFCC00';
                notification.style.color = '#000';
                break;
            default:
                notification.style.background = '#17A2B8';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Dados iniciais
    loadInitialData() {
        // Se não há dados, criar alguns exemplos
        if (this.getClientes().length === 0) {
            this.initExampleData();
        }
    }

    initExampleData() {
        // Adicionar alguns clientes de exemplo se não existirem
        const clientes = this.getClientes();
        if (clientes.length === 0) {
            this.addCliente({
                nome: 'João Silva',
                telefone: '(11) 99999-9999',
                email: 'joao@email.com',
                documento: '123.456.789-00',
                endereco: 'Rua das Flores, 123'
            });
            
            this.addCliente({
                nome: 'Maria Santos',
                telefone: '(11) 88888-8888',
                email: 'maria@email.com',
                documento: '987.654.321-00',
                endereco: 'Av. Principal, 456'
            });
        }

        // Adicionar alguns serviços de exemplo
        const servicos = this.getServicos();
        if (servicos.length === 0) {
            this.addServico({
                nome: 'Lavagem Completa',
                descricao: 'Lavagem externa e interna completa',
                preco: 25.00,
                duracao: '1h',
                categoria: 'Lavagem'
            });
            
            this.addServico({
                nome: 'Enceramento',
                descricao: 'Aplicação de cera protetora',
                preco: 50.00,
                duracao: '2h',
                categoria: 'Estética'
            });
        }

        // Adicionar alguns produtos de exemplo
        const produtos = this.getProdutos();
        if (produtos.length === 0) {
            this.addProduto({
                nome: 'Shampoo Automotivo',
                categoria: 'Limpeza',
                quantidade: 15,
                estoqueMinimo: 5,
                preco: 12.50
            });
            
            this.addProduto({
                nome: 'Cera Líquida',
                categoria: 'Estética',
                quantidade: 8,
                estoqueMinimo: 10,
                preco: 35.00
            });

            this.addProduto({
                nome: 'Pano Microfibra',
                categoria: 'Acessórios',
                quantidade: 25,
                estoqueMinimo: 15,
                preco: 8.90
            });

            this.addProduto({
                nome: 'Pneu Brilho',
                categoria: 'Estética',
                quantidade: 2,
                estoqueMinimo: 5,
                preco: 18.50
            });
        }

        // Veículos de exemplo
        const clientesParaVeiculos = this.getClientes();
        if (clientesParaVeiculos.length > 0) {
            const veiculosExemplo = [
                {
                    clienteId: clientesParaVeiculos[0].id,
                    placa: 'ABC-1234',
                    marca: 'Toyota',
                    modelo: 'Corolla',
                    cor: 'Prata',
                    ano: 2020
                },
                {
                    clienteId: clientesParaVeiculos[1].id,
                    placa: 'XYZ-5678',
                    marca: 'Honda',
                    modelo: 'Civic',
                    cor: 'Preto',
                    ano: 2019
                }
            ];

            veiculosExemplo.forEach(veiculo => this.addVeiculo(veiculo));
        }

        // Produtos de exemplo para estoque
        const produtosExemplo = [
            {
                nome: 'Shampoo Automotivo Premium',
                categoria: 'Shampoo',
                quantidade: 25,
                estoqueMinimo: 5,
                preco: 15.90,
                descricao: 'Shampoo concentrado para lavagem automotiva'
            },
            {
                nome: 'Cera Carnaúba',
                categoria: 'Cera',
                quantidade: 3,
                estoqueMinimo: 5,
                preco: 45.00,
                descricao: 'Cera de carnaúba para proteção da pintura'
            },
            {
                nome: 'Pano Microfibra',
                categoria: 'Acessórios',
                quantidade: 0,
                estoqueMinimo: 10,
                preco: 8.50,
                descricao: 'Pano de microfibra para secagem'
            },
            {
                nome: 'Pretinho Pneu',
                categoria: 'Pneu',
                quantidade: 12,
                estoqueMinimo: 3,
                preco: 12.90,
                descricao: 'Renovador de pneus com brilho'
            }
        ];

        produtosExemplo.forEach(produto => this.addProduto(produto));
    }

    // ===== FUNCIONÁRIOS =====

    getFuncionarios() {
        return JSON.parse(localStorage.getItem('funcionarios')) || [];
    }

    addFuncionario(funcionario) {
        const funcionarios = this.getFuncionarios();
        funcionario.id = Date.now().toString();
        funcionario.status = 'livre'; // livre, ocupado
        funcionario.veiculoAtual = null;
        funcionario.createdAt = new Date().toISOString();
        funcionarios.push(funcionario);
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
        this.updateDesignacoes();
        return funcionario;
    }

    updateFuncionario(id, dados) {
        const funcionarios = this.getFuncionarios();
        const index = funcionarios.findIndex(f => f.id === id);
        if (index !== -1) {
            funcionarios[index] = { ...funcionarios[index], ...dados };
            localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
            this.updateDesignacoes();
        }
    }

    deleteFuncionario(id) {
        const funcionarios = this.getFuncionarios();
        const filtered = funcionarios.filter(f => f.id !== id);
        localStorage.setItem('funcionarios', JSON.stringify(filtered));
        this.updateDesignacoes();
    }

    designarVeiculo(funcionarioId, veiculoId) {
        const funcionarios = this.getFuncionarios();
        const funcionario = funcionarios.find(f => f.id === funcionarioId);
        
        if (funcionario && funcionario.status === 'livre') {
            funcionario.status = 'ocupado';
            funcionario.veiculoAtual = veiculoId;
            localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
            this.updateDesignacoes();
            this.showNotification(`Veículo designado para ${funcionario.nome}!`, 'success');
        }
    }

    liberarFuncionario(funcionarioId) {
        const funcionarios = this.getFuncionarios();
        const funcionario = funcionarios.find(f => f.id === funcionarioId);
        
        if (funcionario) {
            funcionario.status = 'livre';
            funcionario.veiculoAtual = null;
            localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
            this.updateDesignacoes();
            this.showNotification(`${funcionario.nome} foi liberado!`, 'success');
        }
    }

    renderFuncionarios() {
        const funcionarios = this.getFuncionarios();
        const veiculos = this.getVeiculos();
        const clientes = this.getClientes();
        const container = document.getElementById('funcionarios-grid');

        if (funcionarios.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Nenhum funcionário cadastrado</p>
                    <p style="font-size: 0.9rem;">Clique em "Novo Funcionário" para começar</p>
                </div>
            `;
            return;
        }

        container.innerHTML = funcionarios.map(funcionario => {
            let veiculoInfo = '';
            if (funcionario.veiculoAtual) {
                const veiculo = veiculos.find(v => v.id === funcionario.veiculoAtual);
                const cliente = clientes.find(c => c.id === veiculo?.clienteId);
                if (veiculo) {
                    veiculoInfo = `
                        <div class="veiculo-designado">
                            <h5>🚗 ${veiculo.placa}</h5>
                            <div class="veiculo-info">
                                <p>${veiculo.marca} ${veiculo.modelo}</p>
                                <p>👤 ${cliente?.nome || 'Cliente não encontrado'}</p>
                            </div>
                            <button class="btn-liberar" onclick="artDetail.liberarFuncionario('${funcionario.id}')">
                                <i class="fas fa-check"></i> Concluir
                            </button>
                        </div>
                    `;
                }
            }

            const statusClass = funcionario.status === 'livre' ? 'funcionario-livre' : 'funcionario-ocupado';
            const statusText = funcionario.status === 'livre' ? '💤 Livre' : '🔧 Ocupado';

            return `
                <div class="funcionario-card ${statusClass}" style="border-color: ${funcionario.cor};">
                    <div class="funcionario-header">
                        <div class="funcionario-avatar" style="background-color: ${funcionario.cor};">
                            ${funcionario.nome.charAt(0).toUpperCase()}
                        </div>
                        <div class="funcionario-info">
                            <h4>${funcionario.nome}</h4>
                            <div class="funcionario-status">${statusText}</div>
                        </div>
                    </div>
                    ${veiculoInfo}
                </div>
            `;
        }).join('');
    }

    renderVeiculosAguardando() {
        const veiculos = this.getVeiculos();
        const clientes = this.getClientes();
        const funcionarios = this.getFuncionarios();
        const container = document.getElementById('veiculos-aguardando');

        // Filtrar veículos que não estão designados
        const veiculosDesignados = funcionarios.filter(f => f.veiculoAtual).map(f => f.veiculoAtual);
        const veiculosAguardando = veiculos.filter(v => !veiculosDesignados.includes(v.id));

        if (veiculosAguardando.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-car" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Nenhum veículo aguardando</p>
                    <p style="font-size: 0.9rem;">Todos os veículos estão designados ou não há veículos cadastrados</p>
                </div>
            `;
            return;
        }

        container.innerHTML = veiculosAguardando.map(veiculo => {
            const cliente = clientes.find(c => c.id === veiculo.clienteId);
            const funcionariosLivres = funcionarios.filter(f => f.status === 'livre');

            return `
                <div class="veiculo-aguardando">
                    <div class="veiculo-aguardando-info">
                        <h5>🚗 ${veiculo.placa}</h5>
                        <p>${veiculo.marca} ${veiculo.modelo} - ${veiculo.cor}</p>
                        <p>👤 ${cliente?.nome || 'Cliente não encontrado'}</p>
                    </div>
                    <div>
                        ${funcionariosLivres.length > 0 ? `
                            <select id="funcionario-select-${veiculo.id}" style="margin-right: 0.5rem; padding: 0.25rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="">Selecionar funcionário</option>
                                ${funcionariosLivres.map(f => `
                                    <option value="${f.id}" style="color: ${f.cor};">${f.nome}</option>
                                `).join('')}
                            </select>
                            <button class="btn-designar" onclick="artDetail.designarVeiculoSelecionado('${veiculo.id}')">
                                <i class="fas fa-arrow-right"></i> Designar
                            </button>
                        ` : `
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">
                                <i class="fas fa-clock"></i> Aguardando funcionário livre
                            </span>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    designarVeiculoSelecionado(veiculoId) {
        const select = document.getElementById(`funcionario-select-${veiculoId}`);
        const funcionarioId = select.value;
        
        if (funcionarioId) {
            this.designarVeiculo(funcionarioId, veiculoId);
        } else {
            this.showNotification('Selecione um funcionário!', 'warning');
        }
    }

    updateDesignacoes() {
        if (document.getElementById('funcionarios-grid')) {
            this.renderFuncionarios();
        }
        if (document.getElementById('veiculos-aguardando')) {
            this.renderVeiculosAguardando();
        }
    }

    // ===== RELATÓRIOS =====

    updateRelatorios() {
        const clientes = this.getClientes();
        const veiculos = this.getVeiculos();
        const servicos = this.getServicos();
        const produtos = this.getProdutos();

        // Atualizar contadores
        document.getElementById('relatorio-clientes').textContent = clientes.length;
        document.getElementById('relatorio-veiculos').textContent = veiculos.length;
        document.getElementById('relatorio-servicos').textContent = servicos.filter(s => s.active).length;
        document.getElementById('relatorio-produtos').textContent = produtos.length;

        // Produtos com estoque baixo
        this.renderProdutosEstoqueBaixo();
    }

    renderProdutosEstoqueBaixo() {
        const produtos = this.getProdutos();
        const produtosBaixo = produtos.filter(p => this.getStockStatus(p) !== 'ok');
        const container = document.getElementById('produtos-estoque-baixo');

        if (produtosBaixo.length === 0) {
            container.innerHTML = `
                <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
                    <i class="fas fa-check-circle" style="color: #10B981; margin-right: 0.5rem;"></i>
                    Todos os produtos estão com estoque adequado
                </p>
            `;
            return;
        }

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Estoque Atual</th>
                        <th>Estoque Mínimo</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${produtosBaixo.map(produto => {
                        const status = this.getStockStatus(produto);
                        const statusClass = `stock-${status}`;
                        const statusText = status === 'out' ? 'SEM ESTOQUE' : 'ESTOQUE BAIXO';
                        
                        return `
                            <tr>
                                <td>${produto.nome}</td>
                                <td>${produto.categoria}</td>
                                <td>${produto.quantidade}</td>
                                <td>${produto.estoqueMinimo}</td>
                                <td>
                                    <div class="stock-status">
                                        <div class="stock-indicator ${statusClass}"></div>
                                        ${statusText}
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    // Função auxiliar para criar estilos avançados
    createAdvancedStyles() {
        return {
            // Título principal com gradiente azul
            titleStyle: {
                font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "1E40AF" } }, // Azul escuro
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'thick', color: { rgb: "3B82F6" } },
                    bottom: { style: 'thick', color: { rgb: "3B82F6" } },
                    left: { style: 'thick', color: { rgb: "3B82F6" } },
                    right: { style: 'thick', color: { rgb: "3B82F6" } }
                }
            },
            // Cabeçalho de seção com gradiente verde
            sectionHeaderStyle: {
                font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "059669" } }, // Verde escuro
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'medium', color: { rgb: "10B981" } },
                    bottom: { style: 'medium', color: { rgb: "10B981" } },
                    left: { style: 'medium', color: { rgb: "10B981" } },
                    right: { style: 'medium', color: { rgb: "10B981" } }
                }
            },
            // Cabeçalho de tabela com gradiente cinza
            tableHeaderStyle: {
                font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "374151" } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'medium', color: { rgb: "6B7280" } },
                    bottom: { style: 'medium', color: { rgb: "6B7280" } },
                    left: { style: 'thin', color: { rgb: "6B7280" } },
                    right: { style: 'thin', color: { rgb: "6B7280" } }
                }
            },
            // Células de dados com alternância de cores
            dataRowEvenStyle: {
                font: { sz: 11, color: { rgb: "1F2937" } },
                fill: { fgColor: { rgb: "F9FAFB" } }, // Cinza muito claro
                alignment: { vertical: 'center' },
                border: {
                    top: { style: 'thin', color: { rgb: "E5E7EB" } },
                    bottom: { style: 'thin', color: { rgb: "E5E7EB" } },
                    left: { style: 'thin', color: { rgb: "E5E7EB" } },
                    right: { style: 'thin', color: { rgb: "E5E7EB" } }
                }
            },
            dataRowOddStyle: {
                font: { sz: 11, color: { rgb: "1F2937" } },
                fill: { fgColor: { rgb: "FFFFFF" } },
                alignment: { vertical: 'center' },
                border: {
                    top: { style: 'thin', color: { rgb: "E5E7EB" } },
                    bottom: { style: 'thin', color: { rgb: "E5E7EB" } },
                    left: { style: 'thin', color: { rgb: "E5E7EB" } },
                    right: { style: 'thin', color: { rgb: "E5E7EB" } }
                }
            },
            // Status de estoque com cores vibrantes
            stockOkStyle: {
                font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "10B981" } }, // Verde vibrante
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'medium', color: { rgb: "059669" } },
                    bottom: { style: 'medium', color: { rgb: "059669" } },
                    left: { style: 'medium', color: { rgb: "059669" } },
                    right: { style: 'medium', color: { rgb: "059669" } }
                }
            },
            stockLowStyle: {
                font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "F59E0B" } }, // Amarelo vibrante
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'medium', color: { rgb: "D97706" } },
                    bottom: { style: 'medium', color: { rgb: "D97706" } },
                    left: { style: 'medium', color: { rgb: "D97706" } },
                    right: { style: 'medium', color: { rgb: "D97706" } }
                }
            },
            stockOutStyle: {
                font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "EF4444" } }, // Vermelho vibrante
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'medium', color: { rgb: "DC2626" } },
                    bottom: { style: 'medium', color: { rgb: "DC2626" } },
                    left: { style: 'medium', color: { rgb: "DC2626" } },
                    right: { style: 'medium', color: { rgb: "DC2626" } }
                }
            },
            // Valores monetários destacados
            moneyStyle: {
                font: { bold: true, sz: 11, color: { rgb: "059669" } },
                fill: { fgColor: { rgb: "ECFDF5" } }, // Verde muito claro
                alignment: { horizontal: 'right', vertical: 'center' },
                border: {
                    top: { style: 'thin', color: { rgb: "10B981" } },
                    bottom: { style: 'thin', color: { rgb: "10B981" } },
                    left: { style: 'thin', color: { rgb: "10B981" } },
                    right: { style: 'thin', color: { rgb: "10B981" } }
                }
            }
        };
    }

    // Função para aplicar estilos em uma planilha
    applyStylesToWorksheet(ws, data, styles, hasHeader = true) {
        const range = XLSX.utils.decode_range(ws['!ref']);
        
        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
                
                if (!ws[cellRef]) continue;
                
                // Garantir que a célula tenha a estrutura necessária
                if (!ws[cellRef].s) ws[cellRef].s = {};
                
                // Aplicar estilos baseado na posição e conteúdo
                if (row === 0) {
                    // Título principal
                    ws[cellRef].s = styles.titleStyle;
                } else if (hasHeader && row === 2) {
                    // Cabeçalho da tabela
                    ws[cellRef].s = styles.tableHeaderStyle;
                } else if (row > 2) {
                    // Dados da tabela com alternância de cores
                    const isEven = (row - 3) % 2 === 0;
                    ws[cellRef].s = isEven ? styles.dataRowEvenStyle : styles.dataRowOddStyle;
                    
                    // Aplicar estilos especiais para valores monetários
                    if (ws[cellRef].v && typeof ws[cellRef].v === 'string' && ws[cellRef].v.includes('R$')) {
                        ws[cellRef].s = styles.moneyStyle;
                    }
                }
            }
        }
    }

    // Exportação de Relatórios
    exportRelatoriGeral() {
        const clientes = this.getClientes();
        const veiculos = this.getVeiculos();
        const servicos = this.getServicos();
        const produtos = this.getProdutos();

        // Criar workbook e estilos avançados
        const wb = XLSX.utils.book_new();
        const styles = this.createAdvancedStyles();

        // PLANILHA 1: RESUMO EXECUTIVO
        const resumoData = [
            ['🏆 RELATÓRIO GERAL - ART DETAIL 🏆'],
            ['📅 Data de Geração:', new Date().toLocaleString('pt-BR')],
            [''],
            ['📊 RESUMO GERAL'],
            ['👥 Total de Clientes:', clientes.length],
            ['🚗 Total de Veículos:', veiculos.length],
            ['⚙️ Serviços Ativos:', servicos.filter(s => s.active).length],
            ['📦 Total de Produtos:', produtos.length],
            ['⚠️ Produtos com Estoque Baixo:', produtos.filter(p => this.getStockStatus(p) === 'low').length],
            ['🚫 Produtos sem Estoque:', produtos.filter(p => this.getStockStatus(p) === 'out').length],
            ['💰 Valor Total do Estoque:', `R$ ${produtos.reduce((total, produto) => total + (produto.quantidade * produto.preco), 0).toFixed(2)}`]
        ];

        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
        
        // Aplicar formatação avançada
        wsResumo['A1'].s = styles.titleStyle;
        wsResumo['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
        
        // Formatação especial para seções
        wsResumo['A4'].s = styles.sectionHeaderStyle;
        wsResumo['!merges'].push({ s: { r: 3, c: 0 }, e: { r: 3, c: 1 } });
        
        // Formatação para valores monetários
        if (!wsResumo['B11']) wsResumo['B11'] = {};
        wsResumo['B11'].s = styles.moneyStyle;
        
        // Aplicar estilos gerais
        this.applyStylesToWorksheet(wsResumo, resumoData, styles, false);
        
        // Definir largura das colunas
        wsResumo['!cols'] = [{ wch: 30 }, { wch: 25 }];
        
        // Definir altura das linhas
        wsResumo['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 18 }, // Data
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Seção
            ...Array(7).fill({ hpt: 16 }) // Dados
        ];

        XLSX.utils.book_append_sheet(wb, wsResumo, '🏆 Resumo Executivo');

        // PLANILHA 2: CLIENTES
        const clientesData = [
            ['👥 CLIENTES POR QUANTIDADE DE VEÍCULOS'],
            [''],
            ['👤 Cliente', '📞 Telefone', '📧 Email', '🚗 Qtd Veículos', '📅 Data Cadastro']
        ];

        clientes.forEach(cliente => {
            const clienteVeiculos = veiculos.filter(v => v.clienteId === cliente.id);
            clientesData.push([
                cliente.nome,
                cliente.telefone,
                cliente.email || '',
                clienteVeiculos.length,
                this.formatDateTime(cliente.createdAt)
            ]);
        });

        const wsClientes = XLSX.utils.aoa_to_sheet(clientesData);
        
        // Aplicar formatação avançada
        wsClientes['A1'].s = styles.titleStyle;
        wsClientes['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
        
        // Aplicar estilos gerais
        this.applyStylesToWorksheet(wsClientes, clientesData, styles, true);
        
        wsClientes['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 30 }, { wch: 15 }, { wch: 20 }];
        wsClientes['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Cabeçalho
            ...Array(clientes.length).fill({ hpt: 16 }) // Dados
        ];
        
        XLSX.utils.book_append_sheet(wb, wsClientes, '👥 Clientes');

        // PLANILHA 3: PRODUTOS COM ESTOQUE BAIXO
        const estoqueData = [
            ['⚠️ PRODUTOS COM ESTOQUE BAIXO'],
            [''],
            ['📦 Produto', '🏷️ Categoria', '📊 Estoque Atual', '📉 Estoque Mínimo', '🔴 Status', '💰 Valor Total']
        ];

        const produtosBaixo = produtos.filter(p => this.getStockStatus(p) !== 'ok');
        produtosBaixo.forEach(produto => {
            const status = this.getStockStatus(produto);
            const valorTotal = produto.quantidade * produto.preco;
            estoqueData.push([
                produto.nome,
                produto.categoria,
                produto.quantidade,
                produto.estoqueMinimo,
                status === 'out' ? '🚫 SEM ESTOQUE' : '⚠️ ESTOQUE BAIXO',
                `R$ ${valorTotal.toFixed(2)}`
            ]);
        });

        const wsEstoque = XLSX.utils.aoa_to_sheet(estoqueData);
        
        // Aplicar formatação avançada
        wsEstoque['A1'].s = styles.titleStyle;
        wsEstoque['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
        
        // Aplicar estilos gerais
        this.applyStylesToWorksheet(wsEstoque, estoqueData, styles, true);
        
        // Aplicar cores especiais para status de estoque
        for (let row = 3; row < estoqueData.length; row++) {
            const statusCell = XLSX.utils.encode_cell({ r: row, c: 4 });
            const valorCell = XLSX.utils.encode_cell({ r: row, c: 5 });
            const statusValue = estoqueData[row][4];
            
            if (wsEstoque[statusCell]) {
                if (statusValue.includes('SEM ESTOQUE')) {
                    wsEstoque[statusCell].s = styles.stockOutStyle;
                } else {
                    wsEstoque[statusCell].s = styles.stockLowStyle;
                }
            }
            
            // Destacar valores monetários
            if (wsEstoque[valorCell]) {
                wsEstoque[valorCell].s = styles.moneyStyle;
            }
        }
        
        wsEstoque['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 15 }];
        wsEstoque['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Cabeçalho
            ...Array(produtosBaixo.length).fill({ hpt: 16 }) // Dados
        ];
        
        XLSX.utils.book_append_sheet(wb, wsEstoque, '⚠️ Estoque Baixo');

        // Salvar arquivo
        const fileName = `relatorio-geral-artdetail-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        this.showNotification('Relatório geral exportado com sucesso! 🎉', 'success');
    }

    exportRelatorioDetalhado() {
        const clientes = this.getClientes();
        const veiculos = this.getVeiculos();
        const servicos = this.getServicos();
        const produtos = this.getProdutos();

        // Criar workbook com múltiplas planilhas e estilos avançados
        const wb = XLSX.utils.book_new();
        const styles = this.createAdvancedStyles();

        // PLANILHA 1: CLIENTES DETALHADOS
        const clientesData = [
            ['👥 CLIENTES DETALHADOS - ART DETAIL 👥'],
            [''],
            ['👤 Nome', '📞 Telefone', '📧 Email', '📄 Documento', '🏠 Endereço', '🚗 Qtd Veículos', '📅 Data Cadastro']
        ];

        clientes.forEach(cliente => {
            const clienteVeiculos = veiculos.filter(v => v.clienteId === cliente.id);
            clientesData.push([
                cliente.nome,
                cliente.telefone,
                cliente.email || '',
                cliente.documento || '',
                cliente.endereco || '',
                clienteVeiculos.length,
                this.formatDateTime(cliente.createdAt)
            ]);
        });

        const wsClientes = XLSX.utils.aoa_to_sheet(clientesData);
        
        // Aplicar formatação avançada
        if (!wsClientes['A1']) wsClientes['A1'] = {};
        wsClientes['A1'].s = styles.titleStyle;
        wsClientes['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
        
        // Aplicar estilos gerais
        this.applyStylesToWorksheet(wsClientes, clientesData, styles, true);
        
        wsClientes['!cols'] = [
            { wch: 30 }, { wch: 18 }, { wch: 30 }, { wch: 18 }, 
            { wch: 35 }, { wch: 15 }, { wch: 20 }
        ];
        wsClientes['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Cabeçalho
            ...Array(clientes.length).fill({ hpt: 16 }) // Dados
        ];

        XLSX.utils.book_append_sheet(wb, wsClientes, '👥 Clientes');

        // PLANILHA 2: VEÍCULOS DETALHADOS
        const veiculosData = [
            ['🚗 VEÍCULOS DETALHADOS - ART DETAIL 🚗'],
            [''],
            ['🔖 Placa', '🏭 Marca', '🚙 Modelo', '🎨 Cor', '📅 Ano', '👤 Cliente', '📞 Tel. Cliente', '📸 Qtd Fotos', '📅 Data Cadastro']
        ];

        veiculos.forEach(veiculo => {
            const cliente = clientes.find(c => c.id === veiculo.clienteId);
            const qtdFotos = veiculo.images ? veiculo.images.length : 0;
            veiculosData.push([
                veiculo.placa,
                veiculo.marca || '',
                veiculo.modelo || '',
                veiculo.cor || '',
                veiculo.ano || '',
                cliente ? cliente.nome : 'N/A',
                cliente ? cliente.telefone : 'N/A',
                qtdFotos,
                this.formatDateTime(veiculo.createdAt)
            ]);
        });

        const wsVeiculos = XLSX.utils.aoa_to_sheet(veiculosData);
        
        // Aplicar formatação avançada
        if (!wsVeiculos['A1']) wsVeiculos['A1'] = {};
        wsVeiculos['A1'].s = styles.titleStyle;
        wsVeiculos['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];
        
        // Aplicar estilos gerais
        this.applyStylesToWorksheet(wsVeiculos, veiculosData, styles, true);
        
        wsVeiculos['!cols'] = [
            { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 10 },
            { wch: 30 }, { wch: 18 }, { wch: 12 }, { wch: 20 }
        ];
        wsVeiculos['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Cabeçalho
            ...Array(veiculos.length).fill({ hpt: 16 }) // Dados
        ];

        XLSX.utils.book_append_sheet(wb, wsVeiculos, '🚗 Veículos');

        // PLANILHA 3: SERVIÇOS DETALHADOS
        const servicosData = [
            ['⚙️ SERVIÇOS DETALHADOS - ART DETAIL ⚙️'],
            [''],
            ['🛠️ Nome', '📝 Descrição', '💰 Preço', '⏱️ Duração (min)', '✅ Status', '📅 Data Cadastro']
        ];

        servicos.forEach(servico => {
            servicosData.push([
                servico.nome,
                servico.descricao || '',
                `R$ ${servico.preco.toFixed(2)}`,
                servico.duracao,
                servico.active ? 'Ativo' : 'Inativo',
                this.formatDateTime(servico.createdAt)
            ]);
        });

        const wsServicos = XLSX.utils.aoa_to_sheet(servicosData);
        
        // Aplicar formatação avançada
        if (!wsServicos['A1']) wsServicos['A1'] = {};
        wsServicos['A1'].s = styles.titleStyle;
        wsServicos['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
        
        // Aplicar estilos gerais
        this.applyStylesToWorksheet(wsServicos, servicosData, styles, true);
        
        // Destacar valores monetários
        for (let row = 3; row < servicosData.length; row++) {
            const precoCell = XLSX.utils.encode_cell({ r: row, c: 2 });
            if (wsServicos[precoCell]) {
                wsServicos[precoCell].s = styles.moneyStyle;
            }
        }
        
        wsServicos['!cols'] = [
            { wch: 30 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 20 }
        ];
        wsServicos['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Cabeçalho
            ...Array(servicos.length).fill({ hpt: 16 }) // Dados
        ];

        XLSX.utils.book_append_sheet(wb, wsServicos, '⚙️ Serviços');

        // PLANILHA 4: ESTOQUE DETALHADO
        const estoqueData = [
            ['📦 ESTOQUE DETALHADO - ART DETAIL 📦'],
            [''],
            ['📦 Nome', '🏷️ Categoria', '📝 Descrição', '📊 Quantidade', '📉 Est. Mínimo', '💰 Preço Unit.', '🔴 Status', '💵 Valor Total', '📅 Data Cadastro']
        ];

        produtos.forEach(produto => {
            const status = this.getStockStatus(produto);
            const statusText = status === 'out' ? 'SEM ESTOQUE' : status === 'low' ? 'ESTOQUE BAIXO' : 'ESTOQUE OK';
            const valorTotal = produto.quantidade * produto.preco;
            estoqueData.push([
                produto.nome,
                produto.categoria,
                produto.descricao || '',
                produto.quantidade,
                produto.estoqueMinimo,
                `R$ ${produto.preco.toFixed(2)}`,
                statusText,
                `R$ ${valorTotal.toFixed(2)}`,
                this.formatDateTime(produto.createdAt)
            ]);
        });

        const wsEstoque = XLSX.utils.aoa_to_sheet(estoqueData);
        
        // Aplicar formatação avançada
        wsEstoque['A1'].s = styles.titleStyle;
        wsEstoque['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];
        
        // Aplicar estilos gerais
        this.applyStylesToWorksheet(wsEstoque, estoqueData, styles, true);
        
        // Colorir células de status baseado no estoque e valores monetários
        for (let row = 3; row < estoqueData.length; row++) {
            const statusCell = XLSX.utils.encode_cell({ r: row, c: 6 });
            const precoCell = XLSX.utils.encode_cell({ r: row, c: 5 });
            const valorCell = XLSX.utils.encode_cell({ r: row, c: 7 });
            const statusValue = estoqueData[row][6];
            
            if (wsEstoque[statusCell]) {
                if (statusValue === 'SEM ESTOQUE') {
                    wsEstoque[statusCell].s = styles.stockOutStyle;
                } else if (statusValue === 'ESTOQUE BAIXO') {
                    wsEstoque[statusCell].s = styles.stockLowStyle;
                } else {
                    wsEstoque[statusCell].s = styles.stockOkStyle;
                }
            }
            
            // Destacar valores monetários
            if (wsEstoque[precoCell]) {
                wsEstoque[precoCell].s = styles.moneyStyle;
            }
            if (wsEstoque[valorCell]) {
                wsEstoque[valorCell].s = styles.moneyStyle;
            }
        }
        
        wsEstoque['!cols'] = [
            { wch: 30 }, { wch: 18 }, { wch: 35 }, { wch: 12 }, { wch: 15 },
            { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 20 }
        ];
        wsEstoque['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Cabeçalho
            ...Array(produtos.length).fill({ hpt: 16 }) // Dados
        ];

        XLSX.utils.book_append_sheet(wb, wsEstoque, '📦 Estoque');

        // PLANILHA 5: RESUMO EXECUTIVO
        const resumoData = [
            ['🏆 RESUMO EXECUTIVO - ART DETAIL 🏆'],
            ['📅 Data/Hora da Exportação:', new Date().toLocaleString('pt-BR')],
            [''],
            ['📊 MÉTRICAS GERAIS'],
            ['👥 Total de Clientes:', clientes.length],
            ['🚗 Total de Veículos:', veiculos.length],
            ['✅ Serviços Ativos:', servicos.filter(s => s.active).length],
            ['❌ Serviços Inativos:', servicos.filter(s => !s.active).length],
            [''],
            ['📦 CONTROLE DE ESTOQUE'],
            ['📦 Total de Produtos:', produtos.length],
            ['✅ Produtos com Estoque OK:', produtos.filter(p => this.getStockStatus(p) === 'ok').length],
            ['⚠️ Produtos com Estoque Baixo:', produtos.filter(p => this.getStockStatus(p) === 'low').length],
            ['🚫 Produtos sem Estoque:', produtos.filter(p => this.getStockStatus(p) === 'out').length],
            [''],
            ['💰 VALORES FINANCEIROS'],
            ['💵 Valor Total do Estoque:', `R$ ${produtos.reduce((total, produto) => total + (produto.quantidade * produto.preco), 0).toFixed(2)}`]
        ];

        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
        
        // Aplicar formatação avançada
        wsResumo['A1'].s = styles.titleStyle;
        wsResumo['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
        
        // Formatação das seções
        const sectionRows = [3, 9, 15];
        sectionRows.forEach(row => {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: 0 });
            if (wsResumo[cellRef]) {
                wsResumo[cellRef].s = styles.sectionHeaderStyle;
                wsResumo['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
            }
        });
        
        // Destacar valor total do estoque
        if (!wsResumo['B16']) wsResumo['B16'] = {};
        wsResumo['B16'].s = styles.moneyStyle;
        
        // Aplicar estilos gerais
        this.applyStylesToWorksheet(wsResumo, resumoData, styles, false);
        
        wsResumo['!cols'] = [{ wch: 35 }, { wch: 30 }];
        wsResumo['!rows'] = [
            { hpt: 25 }, // Título
            { hpt: 18 }, // Data
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Seção 1
            ...Array(4).fill({ hpt: 16 }), // Dados seção 1
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Seção 2
            ...Array(4).fill({ hpt: 16 }), // Dados seção 2
            { hpt: 10 }, // Espaço
            { hpt: 20 }, // Seção 3
            { hpt: 16 } // Dados seção 3
        ];

        XLSX.utils.book_append_sheet(wb, wsResumo, '🏆 Resumo Executivo');

        // Salvar arquivo
        const fileName = `relatorio-detalhado-artdetail-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        this.showNotification('Relatório detalhado exportado com sucesso! 🎉', 'success');
    }

    downloadCSV(data, filename) {
        const csvContent = data.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Extensões: Planos/Assinaturas e Relatórios (sem backend)
(function(){
    // Helpers de armazenamento
    ArtDetailSystem.prototype.getPlanos = function(){
        return JSON.parse(localStorage.getItem('artdetail_planos') || '[]');
    };
    ArtDetailSystem.prototype.savePlanos = function(planos){
        localStorage.setItem('artdetail_planos', JSON.stringify(planos));
    };
    ArtDetailSystem.prototype.addPlano = function(plano){
        const ps = this.getPlanos(); ps.push(plano); this.savePlanos(ps); return plano;
    };
    ArtDetailSystem.prototype.updatePlano = function(id, dados){
        const ps = this.getPlanos(); const i = ps.findIndex(p=>p.id===id);
        if (i!==-1){ ps[i] = { ...ps[i], ...dados }; this.savePlanos(ps); return ps[i]; }
        return null;
    };
    ArtDetailSystem.prototype.deletePlano = function(id){
        this.savePlanos(this.getPlanos().filter(p=>p.id!==id));
    };

    ArtDetailSystem.prototype.getAssinaturas = function(){
        return JSON.parse(localStorage.getItem('artdetail_assinaturas') || '[]');
    };
    ArtDetailSystem.prototype.saveAssinaturas = function(list){
        localStorage.setItem('artdetail_assinaturas', JSON.stringify(list));
    };
    ArtDetailSystem.prototype.addAssinatura = function(a){
        const xs = this.getAssinaturas(); xs.push(a); this.saveAssinaturas(xs); return a;
    };
    ArtDetailSystem.prototype.deleteAssinatura = function(id){
        this.saveAssinaturas(this.getAssinaturas().filter(a=>a.id!==id));
    };

    // Consumos por mês (controle de uso de regras)
    ArtDetailSystem.prototype.getConsumos = function(){
        return JSON.parse(localStorage.getItem('artdetail_consumos') || '[]');
    };
    ArtDetailSystem.prototype.saveConsumos = function(cs){
        localStorage.setItem('artdetail_consumos', JSON.stringify(cs));
    };
    ArtDetailSystem.prototype.registrarConsumo = function(assinaturaId, servicoId, dataISO){
        const d = new Date(dataISO || new Date());
        const anoMes = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        const cs = this.getConsumos();
        const idx = cs.findIndex(c=>c.assinaturaId===assinaturaId && c.servicoId===servicoId && c.anoMes===anoMes);
        if (idx>=0) cs[idx].quantidade = (cs[idx].quantidade||0)+1; else cs.push({ id: this.generateId(), assinaturaId, servicoId, anoMes, quantidade: 1 });
        this.saveConsumos(cs);
    };

    // Precificação com plano
    ArtDetailSystem.prototype.calcularPrecoComPlano = function(clienteId, servicoId, dataISO){
        const servico = this.getServicos().find(s=>s.id===servicoId);
        const precoBase = servico ? Number(servico.preco||0) : 0;
        const assinatura = this.getAssinaturas().find(a=>a.ativo!==false && a.tipoAssinante==='cliente' && a.clienteId===clienteId);
        if (!assinatura) return { precoFinal: precoBase };
        const plano = this.getPlanos().find(p=>p.id===assinatura.planoId && p.ativo!==false);
        if (!plano) return { precoFinal: precoBase };
        const result = { precoFinal: precoBase, descontoPercentual: 0, planoAplicado: plano.nome, consumoRegistrado: false };
        const regra = (plano.regras||[]).find(r=>r.servicoId===servicoId);
        if (regra){
            const d = new Date(dataISO || new Date());
            const anoMes = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
            const usado = (this.getConsumos().find(c=>c.assinaturaId===assinatura.id && c.servicoId===servicoId && c.anoMes===anoMes)?.quantidade) || 0;
            if (usado < (regra.quantidadeMensal||0)){
                if (regra.cobertura==='incluso') result.precoFinal = 0;
                else if (regra.cobertura==='desconto'){ const p = Number(regra.descontoPercentual||0); result.precoFinal = Math.max(0, precoBase*(1-p/100)); result.descontoPercentual=p; }
                this.registrarConsumo(assinatura.id, servicoId, dataISO); result.consumoRegistrado = true; return result;
            }
        }
        const pGeral = Number(plano.descontoPercentual||0);
        if (pGeral>0){ result.precoFinal = Math.max(0, precoBase*(1-pGeral/100)); result.descontoPercentual=pGeral; }
        return result;
    };

    // Renderizações
    ArtDetailSystem.prototype.renderPlanos = function(){
        const tbody = document.getElementById('planos-table'); if (!tbody) return; const planos = this.getPlanos(); const servicos = this.getServicos();
        if (!planos.length){ tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color: var(--text-secondary);">Nenhum plano cadastrado</td></tr>'; return; }
        tbody.innerHTML = planos.map(p=>{
            const regras = (p.regras||[]).map(r=>{ const s = servicos.find(x=>x.id===r.servicoId); const nome = s? s.nome : r.servicoId; return r.cobertura==='incluso'? `${r.quantidadeMensal}x/mês de ${nome} incluso` : `${r.quantidadeMensal}x/mês de ${nome} com ${r.descontoPercentual||0}%`; }).join('<br>') || '-';
            return `<tr>
                <td>${p.nome}</td>
                <td>${p.tipo}</td>
                <td>${p.duracaoMeses||12} meses</td>
                <td>${regras}</td>
                <td><span class="badge ${p.ativo===false?'badge-danger':'badge-success'}">${p.ativo===false?'Inativo':'Ativo'}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="artDetail.updatePlano('${p.id}', {ativo: ${p.ativo===false?'true':'false'}}); artDetail.renderPlanos();" style="padding:0.5rem; margin-right:0.5rem;"><i class="fas fa-toggle-on"></i></button>
                    <button class="btn btn-secondary" onclick="artDetail.deletePlano('${p.id}'); artDetail.renderPlanos();" style="padding:0.5rem; background:#EF4444;"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`; }).join('');
    };

    ArtDetailSystem.prototype.renderAssinaturas = function(){
        const tbody = document.getElementById('assinaturas-table'); if (!tbody) return; const as = this.getAssinaturas(); const planos = this.getPlanos(); const clientes = this.getClientes();
        if (!as.length){ tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color: var(--text-secondary);">Nenhuma assinatura</td></tr>'; return; }
        tbody.innerHTML = as.map(a=>{ const plano = planos.find(p=>p.id===a.planoId); const nomePlano = plano? plano.nome : a.planoId; const nomeAss = a.tipoAssinante==='empresa'? (a.empresaNome||'Empresa') : (clientes.find(c=>c.id===a.clienteId)?.nome||'Cliente'); const status = a.ativo!==false ? 'Ativa' : 'Inativa'; return `<tr><td>${nomeAss}</td><td>${nomePlano}</td><td>${a.inicio||'-'}</td><td>${a.fim||'-'}</td><td><span class="badge ${a.ativo!==false?'badge-success':'badge-danger'}">${status}</span></td><td><button class="btn btn-secondary" onclick="artDetail.deleteAssinatura('${a.id}'); artDetail.renderAssinaturas();" style="padding:0.5rem; background:#EF4444;"><i class="fas fa-trash"></i></button></td></tr>`; }).join('');
    };

    ArtDetailSystem.prototype.renderTopServicos = function(){
        const container = document.getElementById('top-servicos-lista'); if (!container) return; const ag = this.getAgendamentos(); const sv = this.getServicos();
        if (!ag.length){ container.innerHTML = '<p style="color: var(--text-secondary); text-align:center; padding:2rem;">Ainda sem agendamentos registrados</p>'; return; }
        const count = {}; ag.forEach(a=>{ if (a.servicoId) count[a.servicoId]=(count[a.servicoId]||0)+1; });
        const ranking = Object.entries(count).map(([id,c])=>({id,c, s: sv.find(x=>x.id===id)})).filter(x=>x.s).sort((a,b)=>b.c-a.c).slice(0,10);
        if (!ranking.length){ container.innerHTML = '<p style="color: var(--text-secondary); text-align:center; padding:2rem;">Sem dados suficientes</p>'; return; }
        container.innerHTML = `<table class="table"><thead><tr><th>Serviço</th><th>Realizações</th><th>Preço</th></tr></thead><tbody>${ranking.map(r=>`<tr><td>${r.s.nome}</td><td>${r.c}</td><td>${this.formatCurrency(r.s.preco||0)}</td></tr>`).join('')}</tbody></table>`;
    };

    // Override leve: openModal e setupEventListeners e showPage
    const __open = ArtDetailSystem.prototype.openModal;
    ArtDetailSystem.prototype.openModal = function(modalId){
        __open.call(this, modalId);
        const modal = document.getElementById(modalId);
        if (!modal) return;
        if (modalId==='plano-modal'){
            const selectSrv = modal.querySelector('[name="servicoIdRegra"]');
            if (selectSrv){
                const servicos = this.getServicos();
                selectSrv.innerHTML = '<option value="">Selecione o serviço</option>' + servicos.map(s=>`<option value="${s.id}">${s.nome}</option>`).join('');
            }
        }
        if (modalId==='assinatura-modal'){
            const planosSelect = modal.querySelector('[name="planoId"]');
            const clientesSelect = modal.querySelector('[name="clienteId"]');
            if (planosSelect){ const planos = this.getPlanos(); planosSelect.innerHTML = planos.map(p=>`<option value="${p.id}">${p.nome}</option>`).join(''); }
            if (clientesSelect){ const clientes = this.getClientes(); clientesSelect.innerHTML = clientes.map(c=>`<option value="${c.id}">${c.nome}</option>`).join(''); }
        }
        if (modalId==='agendamento-modal'){
            const cliSel = modal.querySelector('[name="clienteId"]');
            const veiSel = modal.querySelector('[name="veiculoId"]');
            const srvSel = modal.querySelector('[name="servicoId"]');
            if (cliSel){ const clientes = this.getClientes(); cliSel.innerHTML = '<option value="">Selecione um cliente</option>' + clientes.map(c=>`<option value="${c.id}">${c.nome}</option>`).join(''); }
            if (veiSel){ const veiculos = this.getVeiculos(); veiSel.innerHTML = '<option value="">Selecione um veículo</option>' + veiculos.map(v=>`<option value="${v.id}">${v.placa} - ${v.marca} ${v.modelo}</option>`).join(''); }
            if (srvSel){ const servicos = this.getServicos(); srvSel.innerHTML = '<option value="">Selecione um serviço</option>' + servicos.filter(s=>s.active).map(s=>`<option value="${s.id}">${s.nome} (${this.formatCurrency(s.preco)})</option>`).join(''); }
        }
    };

    const __setup = ArtDetailSystem.prototype.setupEventListeners;
    ArtDetailSystem.prototype.setupEventListeners = function(){
        __setup.call(this);
        // Agendamento
        const agendamentoForm = document.getElementById('agendamento-form');
        if (agendamentoForm){
            agendamentoForm.addEventListener('submit', (e)=>{
                e.preventDefault();
                const fd = new FormData(agendamentoForm);
                const clienteId = fd.get('clienteId');
                const veiculoId = fd.get('veiculoId');
                const servicoId = fd.get('servicoId');
                const data = fd.get('data');
                const horario = fd.get('horario');
                if (!clienteId || !veiculoId || !servicoId || !data || !horario){ this.showNotification('Preencha todos os campos do agendamento', 'error'); return; }
                const servico = this.getServicos().find(s=>s.id===servicoId);
                const precoOriginal = servico ? Number(servico.preco||0) : 0;
                const pricing = this.calcularPrecoComPlano(clienteId, servicoId, `${data}T${horario}:00`);
                const agendamento = { id: this.generateId(), clienteId, vehicleId: veiculoId, servicoId, scheduledAt: `${data}T${horario}:00`, status: 'PENDING', precoOriginal, precoFinal: pricing.precoFinal ?? precoOriginal, descontoPercentual: pricing.descontoPercentual || 0, planoAplicado: pricing.planoAplicado || null, createdAt: new Date().toISOString() };
                this.addAgendamento(agendamento);
                this.closeModal('agendamento-modal'); agendamentoForm.reset();
                this.updateRelatorios(); this.showNotification(pricing.consumoRegistrado? 'Agendamento criado e consumo do plano registrado' : (pricing.planoAplicado? 'Agendamento criado com desconto de plano' : 'Agendamento criado'), 'success');
            });
        }
        // Plano
        const planoForm = document.getElementById('plano-form');
        if (planoForm){
            planoForm.addEventListener('submit',(e)=>{
                e.preventDefault(); const fd = new FormData(planoForm);
                const plano = { id: this.generateId(), nome: fd.get('nome'), tipo: fd.get('tipo'), duracaoMeses: Number(fd.get('duracao')||12), descontoPercentual: Number(fd.get('descontoPercentual')||0), regras: [], ativo: true, createdAt: new Date().toISOString() };
                const servicoIdRegra = fd.get('servicoIdRegra'); const qtd = Number(fd.get('quantidadeMensal')||0); const cobertura = fd.get('cobertura'); const descontoRegra = Number(fd.get('descontoRegra')||0);
                if (servicoIdRegra && qtd>0){ plano.regras.push({ servicoId: servicoIdRegra, quantidadeMensal: qtd, cobertura: cobertura||'incluso', descontoPercentual: descontoRegra||0 }); }
                this.addPlano(plano); this.closeModal('plano-modal'); planoForm.reset(); this.showNotification('Plano criado com sucesso!', 'success'); this.renderPlanos();
            });
        }
        // Assinatura
        const assinaturaForm = document.getElementById('assinatura-form');
        if (assinaturaForm){
            assinaturaForm.addEventListener('submit',(e)=>{
                e.preventDefault(); const fd = new FormData(assinaturaForm); const tipo = fd.get('tipoAssinante');
                const a = { id: this.generateId(), planoId: fd.get('planoId'), tipoAssinante: tipo, clienteId: tipo==='cliente'? fd.get('clienteId') : null, empresaNome: tipo==='empresa'? (fd.get('empresaNome')||'').trim() : null, inicio: fd.get('inicio')||new Date().toISOString().split('T')[0], fim: fd.get('fim')||null, ativo: true, createdAt: new Date().toISOString() };
                this.addAssinatura(a); this.closeModal('assinatura-modal'); assinaturaForm.reset(); this.showNotification('Assinatura criada!', 'success'); this.renderAssinaturas();
            });
            const tipoSelect = assinaturaForm.querySelector('[name="tipoAssinante"]'); if (tipoSelect){ tipoSelect.addEventListener('change', ()=>{ const isEmp = tipoSelect.value==='empresa'; document.getElementById('campo-cliente-assinatura').style.display = isEmp? 'none' : ''; document.getElementById('campo-empresa-assinatura').style.display = isEmp? '' : 'none'; }); }
        }
    };

    const __show = ArtDetailSystem.prototype.showPage;
    ArtDetailSystem.prototype.showPage = function(pageName){
        __show.call(this, pageName);
        if (pageName==='relatorios'){ this.renderTopServicos(); }
        if (pageName==='planos'){ this.renderPlanos(); this.renderAssinaturas(); }
    };
})();

// Funções globais para os event handlers do HTML
function showPage(pageName) {
    artDetail.showPage(pageName);
}

function openModal(modalId) {
    artDetail.openModal(modalId);
}

function closeModal(modalId) {
    artDetail.closeModal(modalId);
}

// Funções globais para exportação de relatórios
function exportRelatoriGeral() {
    artDetail.exportRelatoriGeral();
}

function exportRelatorioDetalhado() {
    artDetail.exportRelatorioDetalhado();
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar sistema quando a página carregar
let artDetail;
document.addEventListener('DOMContentLoaded', () => {
    artDetail = new ArtDetailSystem();
});

// Fechar modais clicando fora
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

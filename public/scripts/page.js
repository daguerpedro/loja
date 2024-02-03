//TODO: DOCUMENTATION

products = []
bag = {
    items: [],
    ids: []
}

function removefrombag(id) {
    bag.items.splice(bag.items.indexOf(bag.items.find(i => i.id == id)), 1)
    bag.ids.splice(bag.ids.indexOf(id), 1)

    $('#bagflyout').flyout('hide')
    setTimeout(() => {
        openbag()
    }, 1000);
}

function clearbag() {
    bag = {
        items: [],
        ids: []
    }
    $('#bagflyout').flyout('hide')
}

$(document).ready(function () {
    $.ajax({
        url: "/api/products",
        cache: true,
    }).done((data) => {
        $("#prodshow").empty()

        data.forEach(product => {
            products.push(product)
            document.getElementById("prodshow").innerHTML += `
            <div class="column seven wide mobile seven wide tablet five wide computer">
                <div class="ui big card prod" pid="${product.id}">
                    <div class="ui slide masked reveal centered small image">
                        <img src="/images/${product.id}.png" onerror='this.onerror = null; this.src="images/indisponivel.png"' class="visible content">
                        <img src="/images/${product.id}.png" onerror='this.onerror = null; this.src="images/indisponivel.png"' class="hidden content">
                    </div>
                    <div class="content">
                        <a class="header">${product.name}</a>
                        <div class="meta desc">
                            <span class="date">${product.description}</span>
                        </div>
                    </div>
                    <div class="extra content">
                        <i class="dollar sign icon"></i>${product.price} brl
                        <span class="right floated">
                            <i class="cart plus icon"></i>
                        </span>
                    </div>                  
                </div>
            </div>
            `;
        });

        updatesearch();
        $('.prod').click(function () {
            let product = products.find(prod => prod.id = $(this).attr('pid'));
            showproductmodal(product)
        })
    }).fail((v) => {
        $.toast({
            class: 'error',
            title: v.statusText,
            showIcon: 'exclamation triangle',
            message: `Vailed to get products from server!<br>Status: ${v.status}<br>Message:${v.responseText}`
        });
    })

    $('#bag').click(() => {
        openbag();
    })

    updatesearch = () => {
        $('#shopsearch').search({
            source: products,
            ignoreDiacritics: true,
            fields: {
                id: 'id',
                price: 'price',
                title: 'name',
                description: 'description',
                image: 'img'
            },
            searchfields: [
                'id',
                'title',
                'description'
            ],
            onSelect: (product) => {
                showproductmodal(product);
            }
        })
    }


    showproductmodal = (product) => {
        $('#m_p_amount').attr({ "max": product.quantity })
        $('.ui.modal').modal({
            title: `${product.name}`,
            content: `
            <div class="ui medium image">
                <img src="${'images/' + product.id + '.png'}">
            </div>
            <div class="description">
                <div class="ui header">Sobre este produto:</div>
                <p id="bigproddesc">${product.description}</p>
                <div class="ui divider"></div>
                <p class="ui"><span class="ui warning text">(${product.quantity} Restantes)</span></p>        
            </div> `,
            onApprove: function () {
                let obj = { id: product.id, amount: parseInt($('#m_p_amount').val()), product: product };
                if (bag.ids.includes(obj.id)) {
                    let i = bag.items.find(i => i.id == obj.id)
                    i.amount += parseInt($('#m_p_amount').val())
                    if (i.amount > obj.quantity)
                        i.amount = quantity

                    $('#m_p_amount').val(1)
                    openbag();
                    return true;
                }

                bag.items.push(obj)
                bag.ids.push(obj.id)

                $('#m_p_amount').val(1)
                openbag();
                return true;
            }
        })
            .modal('setting', 'transition', 'fade')
            .modal('show');
    }

    openbag = () => {
        let total = 0.0
        bag.items.map(item => total += (item.amount * item.product.price))
        $('#bagflyout').flyout({
            autoShow: true,
            title: '<i class="shopping cart icon"></i> Carrinho de compras',
            class: 'wide',
            closeIcon: true,
            content: `
            <div class="ui ordered list"> 
                ${bag.items.map(item => `
                <a class="item">
                    <div class="content">
                        <div class="header">${item.product.name} (x${item.amount})</div>
                        <div class="description">
                            ${item.product.description} 
                            <br>
                            - $${item.product.price} un.
                            <div>
                                <br><button onclick="removefrombag(${item.product.id})" class="ui tiny icon basic button"> <i class="trash alternate icon"></i> Remover do carrinho </button> 
                                <div class="ui divider"></div>
                            </div>
                        </div>
                    </div>
                </a>`).join('')}
            </div>
            <div>
                Total: $ ${parseFloat(total)} BRL.
                <br>
                <button onclick="clearbag()" class="ui tiny icon red button"> <i class="trash alternate icon"></i> Limpar carrinho </button> 
            </div>
            `,
            actions: [
                {
                    text: 'Finalizar compra',
                    class: 'green',
                    icon: 'save'
                }],
        });
    }
});
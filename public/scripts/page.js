products = []


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

            $('#bigproddesc').text(product.description)
            $('#bigprodimage').attr("src", 'images/' + product.id + '.png')
            $('#bigprodtitle').text(product.name)

            $('.ui.modal').modal('show');
        })
    }).fail(() => {
        console.log("Vailed to get products!");
    })

    $('#bag').click(() => {
        $('#bagflyout').flyout('toggle');
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
            onSelect: (result) => {

                $('#bigproddesc').text(result.description)
                $('#bigprodimage').attr("src", 'images/' + result.id + '.png')
                $('#bigprodtitle').text(result.name)

                $('.ui.modal').modal('show');
            }
        })
    }

});
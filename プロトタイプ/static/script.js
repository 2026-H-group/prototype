document.addEventListener("DOMContentLoaded", () => {

    const items = new URLSearchParams(location.search).get("items") || "1";
    const confirmLink = document.getElementById("confirmLink");
    if (confirmLink) confirmLink.href = `confirm.html?items=${encodeURIComponent(items)}`;
    const catalog = [{id:1,name:"Wool Blend Coat",price:900},{id:2,name:"Denim Trousers",price:1200},{id:3,name:"Knit Cardigan",price:500},{id:4,name:"Canvas Tote Bag",price:700},{id:5,name:"Linen Shirt",price:850},{id:6,name:"Pleated Skirt",price:1100},{id:7,name:"Corduroy Jacket",price:1500},{id:8,name:"Beaded Necklace",price:400}];
    const selected = items.split(",").map(Number).map((id) => catalog.find((item) => item.id === id)).filter(Boolean);
    const subtotal = selected.reduce((sum, item) => sum + item.price, 0);
    const formatYen = (value) => `¥${value.toLocaleString()}`;
    const name = document.getElementById("buyProductName");
    const price = document.querySelector(".product-price");
    const summary = document.querySelectorAll(".summary-list strong");
    if (name) name.textContent = selected.map((item) => item.name).join("、");
    if (price) price.textContent = formatYen(subtotal);
    if (summary[0]) summary[0].textContent = formatYen(subtotal);
    if (summary[2]) summary[2].textContent = formatYen(subtotal + 300);

    /* =========================
       住所の切り替え
    ========================== */

    const addressRadios =
        document.querySelectorAll(
            'input[name="address"]'
        );

    const registeredAddress =
        document.getElementById(
            "registered-address"
        );

    const newAddressForm =
        document.getElementById(
            "new-address-form"
        );


    function updateAddressForm() {

        const selected =
            document.querySelector(
                'input[name="address"]:checked'
            );


        if (!selected) {
            return;
        }


        if (selected.value === "new") {

            registeredAddress.style.display =
                "none";

            newAddressForm.classList.add(
                "active"
            );

        } else {

            registeredAddress.style.display =
                "block";

            newAddressForm.classList.remove(
                "active"
            );

        }

    }


    addressRadios.forEach((radio) => {

        radio.addEventListener(
            "change",
            updateAddressForm
        );

    });


    updateAddressForm();



    /* =========================
       支払い方法の切り替え
    ========================== */

    const paymentRadios =
        document.querySelectorAll(
            'input[name="payment"]'
        );

    const cardBox =
        document.getElementById(
            "card-box"
        );


    function updatePaymentForm() {

        const selected =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        if (!selected) {
            return;
        }


        if (selected.value === "credit") {

            cardBox.style.display =
                "block";

        } else {

            cardBox.style.display =
                "none";

        }

    }


    paymentRadios.forEach((radio) => {

        radio.addEventListener(
            "change",
            updatePaymentForm
        );

    });


    updatePaymentForm();



    /* =========================
       カード番号の入力補助
    ========================== */

    const cardNumber =
        document.getElementById(
            "card-number"
        );


    cardNumber.addEventListener(
        "input",
        () => {

            let value =
                cardNumber.value
                    .replace(/\D/g, "")
                    .slice(0, 16);


            value =
                value.replace(
                    /(.{4})/g,
                    "$1 "
                )
                .trim();


            cardNumber.value =
                value;

        }
    );



    /* =========================
       郵便番号の入力補助
    ========================== */

    const postal =
        document.getElementById(
            "postal"
        );


    postal.addEventListener(
        "input",
        () => {

            let value =
                postal.value
                    .replace(/\D/g, "")
                    .slice(0, 7);


            if (value.length > 3) {

                value =
                    value.slice(0, 3)
                    + "-"
                    + value.slice(3);

            }


            postal.value =
                value;

        }
    );



    /* =========================
       確認画面への遷移
    ========================== */

    const confirmButton =
        document.querySelector(
            ".confirm-btn"
        );


    confirmButton.addEventListener(
        "click",
        (event) => {

            /*
             * 実際のサイトではここで
             * 入力内容のバリデーションや
             * Flaskへの送信処理を行う。
             */

            console.log(
                "確認画面へ移動します"
            );

        }
    );

});
(function() {
    var apiKey = "ZVJ8yTSrJPJmDYED"
    var el = new Everlive(apiKey);

    var groceryDataSource = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "Groceries"
        }
    });

    function initialize() {
        var app = new kendo.mobile.Application(document.body, {
            skin: "flat",
            transition: "slide"
        });
        $("#grocery-list").kendoMobileListView({
            dataSource: groceryDataSource,
            template: "#: Name #"
        });
    }

    window.addView = kendo.observable({
        add: function() {
            if (this.grocery.trim() === "") {
                navigator.notification.alert("Please provide a grocery.");
                return;
            }

            groceryDataSource.add({ Name: this.grocery });
            groceryDataSource.one("sync", this.close);
            groceryDataSource.sync();
        },
        close: function() {
            $("#add").data("kendoMobileModalView").close();
            this.grocery = "";
        }
    });

    window.loginView = kendo.observable({
        submit: function() {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }
            el.Users.login(this.username, this.password,
                function(data) {
                    window.location.href = "#list";
                    groceryDataSource.read();
                }, function() {
                    navigator.notification.alert("Unfortunately we could not find your account.");
                });
        }
    });

    window.registerView = kendo.observable({
        submit: function() {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }
            el.Users.register(this.username, this.password, { Email: this.email },
                function() {
                    navigator.notification.alert("Your account was successfully created.");
                    window.location.href = "#login";
                },
                function() {
                    alert("Unfortunately we were unable to create your account.");
                });
        }
    });

    document.addEventListener("deviceready", initialize);
}());
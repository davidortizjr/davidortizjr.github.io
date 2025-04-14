<?php

$artist = "teezo";

if (isset($_GET['artist'])) {
    $artist = $_GET['artist'];
    switch ($artist) {
        case "teezo":
            $artist = "teezo";
            break;
        case "kendrick":
            $artist = "kendrick";
            break;
        case "daniel":
            $artist = "daniel";
            break;
        default:
            header("Location: ?artist=teezo");
            break;
    }
} else {
    header("Location: ?artist=teezo");
}

?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Activity MVC</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image" href="../../imgs/logo.png">
</head>

<body>

    <nav class="navbar">
        <div class="container-fluid">
            <a class="navbar-brand px-4" href="#" style="color: #fff">My Top Artists</a>
        </div>
    </nav>

    <div class="container-fluid">
        <div class="row">

            <div class="col-6 col-sm-4 col-md-3 col-lg-3">
                <div class="selection shadow" style="height: 100vh; padding-left: 8px; overflow: auto">

                    <!-- artists -->
                    <div class="artists d-flex justify-content-center flex-column align-items-center">
                        <a href="?artist=teezo" style="text-decoration: none;">
                            <div class="card">
                                <div class="profileImage">
                                    <img src="https://preview.redd.it/do-you-think-teezo-touchdown-will-get-signed-to-cactus-jack-v0-mf7x3bn3h87d1.jpeg?auto=webp&s=64ecc7460d5a83367b1d0579d8646b9efa67d3fb"
                                        style="width: 100%; height: 100%; border-radius: 50%;">
                                </div>
                                <div class="textContainer">
                                    <p class="name">Teezo Touchdown</p>
                                    <p class="profile">Profile</p>
                                </div>
                            </div>
                        </a>

                        <a href="?artist=kendrick" style="text-decoration: none;">
                            <div class="card">
                                <div class="profileImage">
                                    <img src="https://wp.dailybruin.com/images/2024/11/GNX-album-cover.jpeg"
                                        style="width: 100%; height: 100%; border-radius: 50%;">
                                </div>
                                <div class="textContainer">
                                    <p class="name">Kendrick Lamar</p>
                                    <p class="profile">Profile</p>
                                </div>
                            </div>
                        </a>

                        <a href="?artist=daniel" style="text-decoration: none;">
                            <div class="card">
                                <div class="profileImage">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREFPqsKjBCDtjk7J0RKGmtFxJO3cJ_Td6I7A&s"
                                        style="width: 100%; height: 100%; border-radius: 50%;">
                                </div>
                                <div class="textContainer">
                                    <p class="name">Daniel Caesar</p>
                                    <p class="profile">Profile</p>
                                </div>
                            </div>
                        </a>

                    </div>

                </div>
            </div>

            <div class="col-6 col-sm-8 col-md-9 col-lg-9">
                <div class="main shadow py-5" style="height: 100vh; max-height: 100vh; overflow: auto">

                    <?php include("shared/" . $artist . ".php"); ?>

                </div>
            </div>
        </div>

    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq"
        crossorigin="anonymous"></script>
</body>

</html>
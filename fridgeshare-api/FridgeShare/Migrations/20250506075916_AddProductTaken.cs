using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FridgeShare.Migrations
{
    /// <inheritdoc />
    public partial class AddProductTaken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductsTaken",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TakenOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuantityTaken = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductsTaken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductsTaken_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductsTaken_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductsTaken_ProductId",
                table: "ProductsTaken",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductsTaken_UserId",
                table: "ProductsTaken",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductsTaken");
        }
    }
}

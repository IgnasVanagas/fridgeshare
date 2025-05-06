using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FridgeShare.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProductTaken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductsTaken");

            migrationBuilder.AddColumn<float>(
                name: "QuantityLeft",
                table: "Products",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuantityLeft",
                table: "Products");

            migrationBuilder.CreateTable(
                name: "ProductsTaken",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    QuantityTaken = table.Column<float>(type: "real", nullable: false),
                    TakenOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductsTaken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductsTaken_Products_ProductId1",
                        column: x => x.ProductId1,
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
                name: "IX_ProductsTaken_ProductId1",
                table: "ProductsTaken",
                column: "ProductId1");

            migrationBuilder.CreateIndex(
                name: "IX_ProductsTaken_UserId",
                table: "ProductsTaken",
                column: "UserId");
        }
    }
}

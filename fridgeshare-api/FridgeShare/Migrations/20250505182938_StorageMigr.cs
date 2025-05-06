using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FridgeShare.Migrations
{
    /// <inheritdoc />
    public partial class StorageMigr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Storages_Communities_CommunityId",
                table: "Storages");

            migrationBuilder.Sql("UPDATE Storages SET CommunityId = 1 WHERE CommunityId IS NULL");


            migrationBuilder.AlterColumn<int>(
                name: "CommunityId",
                table: "Storages",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Storages_Communities_CommunityId",
                table: "Storages",
                column: "CommunityId",
                principalTable: "Communities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Storages_Communities_CommunityId",
                table: "Storages");

            migrationBuilder.AlterColumn<int>(
                name: "CommunityId",
                table: "Storages",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Storages_Communities_CommunityId",
                table: "Storages",
                column: "CommunityId",
                principalTable: "Communities",
                principalColumn: "Id");
        }
    }
}
